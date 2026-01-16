import { describe, it, expect, vi, beforeEach } from 'vitest'
import { csvLinkDownload } from '@/util/csvLink'

// Mock URL.createObjectURL and revokeObjectURL
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: mockCreateObjectURL,
})

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: mockRevokeObjectURL,
})

// Mock document methods
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockClick = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()

  mockCreateObjectURL.mockReturnValue('blob:mock-url')
  mockRevokeObjectURL.mockImplementation(() => {})

  // Mock document.body
  Object.defineProperty(document, 'body', {
    value: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild,
    },
    writable: true,
  })

  // Mock Date
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2024-01-15'))
})

describe('csvLinkDownload', () => {
  it('creates and downloads a CSV file with correct filename', () => {
    const mockBlob = new Blob(['test,data'], { type: 'text/csv' })
    const filename = 'test-file'

    // Mock createElement and setAttribute
    const mockSetAttribute = vi.fn()
    const mockElement = {
      style: '',
      href: '',
      setAttribute: mockSetAttribute,
      click: mockClick,
    }

    vi.spyOn(document, 'createElement').mockReturnValue(mockElement as any)

    csvLinkDownload(mockBlob, filename)

    // Verify URL.createObjectURL was called with the blob
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)

    // Verify link element was created and configured
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockElement.href).toBe('blob:mock-url')
    expect(mockElement.style).toBe('none')
    expect(mockSetAttribute).toHaveBeenCalledWith('download', 'test-file_mon_jan_15_2024.csv')

    // Verify DOM manipulation
    expect(mockAppendChild).toHaveBeenCalledWith(mockElement)
    expect(mockClick).toHaveBeenCalled()
    expect(mockRemoveChild).toHaveBeenCalledWith(mockElement)

    // Verify cleanup
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })

  it('formats filename correctly with date', () => {
    const mockBlob = new Blob(['test'], { type: 'text/csv' })
    const filename = 'my-report'

    const mockSetAttribute = vi.fn()
    const mockElement = {
      style: '',
      href: '',
      setAttribute: mockSetAttribute,
      click: () => {},
    }

    vi.spyOn(document, 'createElement').mockReturnValue(mockElement as any)

    csvLinkDownload(mockBlob, filename)

    expect(mockSetAttribute).toHaveBeenCalledWith('download', 'my-report_mon_jan_15_2024.csv')
  })
})