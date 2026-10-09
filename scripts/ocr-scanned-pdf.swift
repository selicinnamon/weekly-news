import Foundation
import PDFKit
import Vision

// Usage: swift ocr-scanned-pdf.swift input.pdf output-directory 1-4,7,10-12 [image-height]
guard CommandLine.arguments.count >= 4 else {
    fputs("Usage: ocr-scanned-pdf.swift input.pdf output-directory page-list [image-height]\n", stderr)
    exit(2)
}

let input = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
let pageList = CommandLine.arguments[3]
let imageHeight = CommandLine.arguments.count > 4 ? (Int(CommandLine.arguments[4]) ?? 3000) : 3000

guard let document = PDFDocument(url: input), imageHeight >= 1000 else {
    fputs("Could not open PDF or invalid image height.\n", stderr)
    exit(2)
}

var pages = Set<Int>()
for part in pageList.split(separator: ",") {
    let bounds = part.split(separator: "-")
    if bounds.count == 1, let number = Int(bounds[0]) {
        pages.insert(number)
    } else if bounds.count == 2,
              let first = Int(bounds[0]), let last = Int(bounds[1]), first <= last {
        pages.formUnion(first...last)
    } else {
        fputs("Invalid page list: \(pageList)\n", stderr)
        exit(2)
    }
}

try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
let basename = input.deletingPathExtension().lastPathComponent

for pageNumber in pages.sorted() {
    guard pageNumber >= 1, pageNumber <= document.pageCount,
          let page = document.page(at: pageNumber - 1) else {
        fputs("Page \(pageNumber) is outside 1...\(document.pageCount).\n", stderr)
        exit(2)
    }

    let bounds = page.bounds(for: .mediaBox)
    let scale = CGFloat(imageHeight) / bounds.height
    let width = Int((bounds.width * scale).rounded())
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    guard let context = CGContext(data: nil, width: width, height: imageHeight,
                                  bitsPerComponent: 8, bytesPerRow: 0,
                                  space: colorSpace,
                                  bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else {
        fputs("Could not render page \(pageNumber).\n", stderr)
        exit(1)
    }
    context.setFillColor(CGColor(gray: 1, alpha: 1))
    context.fill(CGRect(x: 0, y: 0, width: width, height: imageHeight))
    context.scaleBy(x: scale, y: scale)
    page.draw(with: .mediaBox, to: context)
    guard let image = context.makeImage() else {
        fputs("Could not create image for page \(pageNumber).\n", stderr)
        exit(1)
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    do {
        try VNImageRequestHandler(cgImage: image, options: [:]).perform([request])
        let lines = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }
        let text = lines.joined(separator: "\n") + "\n"
        let destination = output.appendingPathComponent(String(format: "%@-p%03d.txt", basename, pageNumber))
        try text.write(to: destination, atomically: true, encoding: .utf8)
        print("\(basename) p.\(pageNumber): \(lines.count) lines")
    } catch {
        fputs("OCR failed on page \(pageNumber): \(error)\n", stderr)
        exit(1)
    }
}
