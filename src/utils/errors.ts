export class ParseError extends Error {
  code = 'PARSE_ERROR'
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

export class ExportError extends Error {
  code = 'EXPORT_ERROR'
  constructor(message: string) {
    super(message)
    this.name = 'ExportError'
  }
}

export class NumberingError extends Error {
  code = 'NUMBERING_ERROR'
  constructor(message: string) {
    super(message)
    this.name = 'NumberingError'
  }
}
