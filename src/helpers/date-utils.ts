import {format, formatRelative, isMatch, isValid, parse, parseISO} from 'date-fns'

const dateOnlyFormat = 'yyyy-MM-dd'

export const isDateOnly = (value: string): boolean => isMatch(value, dateOnlyFormat)

export const isDateTime = (value: string): boolean => {
  if (!value.includes('T')) {
    return false
  }

  const parsedDate = parseISO(value)

  if (!isValid(parsedDate)) {
    return false
  }

  return /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
}

export const formatDateString = (value: string, dateFormat: string, baseDate: Date = new Date()): null | string => {
  if (isDateOnly(value)) {
    const parsedDate = parse(value, dateOnlyFormat, new Date())
    if (dateFormat === 'relative') {
      return formatRelative(parsedDate, baseDate).split(' at ')[0]
    }

    return format(parsedDate, dateFormat)
  }

  if (isDateTime(value)) {
    const parsedDate = parseISO(value)
    return dateFormat === 'relative' ? formatRelative(parsedDate, baseDate) : format(parsedDate, dateFormat)
  }

  return null
}
