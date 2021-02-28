const nameClass = require('tailwindcss/lib/util/nameClass').default
const transformThemeValue = require('tailwindcss/lib/util/transformThemeValue').default
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default
const toColorValue = require('tailwindcss/lib/util/toColorValue').default
const toRgba = require('tailwindcss/lib/util/withAlphaVariable').toRgba

function transparentTo(value) {
  if (typeof value === 'function') {
    return value({ opacityValue: 0 })
  }

  try {
    const [r, g, b] = toRgba(value)
    return `rgba(${r}, ${g}, ${b}, 0)`
  } catch (_error) {
    return `rgba(255, 255, 255, 0)`
  }
}

module.exports = function ({ jit: { theme, addUtilities, addVariant, e } }) {
  let colorPalette = flattenColorPalette(theme.backgroundColor)

  addUtilities({
    from: [
      (modifier, { theme }) => {
        let value = colorPalette[modifier]
        if (modifier === '' || value === undefined) {
          return []
        }
        let transparentToValue = transparentTo(value)
        return [
          [
            nameClass('from', modifier),
            {
              '--tw-gradient-from': toColorValue(value, 'from'),
              '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${transparentToValue})`,
            },
          ],
        ]
      },
    ],
  })
  addUtilities({
    via: [
      (modifier, { theme }) => {
        let value = colorPalette[modifier]
        if (modifier === '' || value === undefined) {
          return []
        }
        let transparentToValue = transparentTo(value)
        return [
          [
            nameClass('via', modifier),
            {
              '--tw-gradient-stops': `var(--tw-gradient-from), ${toColorValue(
                value,
                'via'
              )}, var(--tw-gradient-to, ${transparentToValue})`,
            },
          ],
        ]
      },
    ],
  })
  addUtilities({
    to: [
      (modifier, { theme }) => {
        let value = colorPalette[modifier]
        if (modifier === '' || value === undefined) {
          return []
        }
        return [
          [
            nameClass('to', modifier),
            {
              '--tw-gradient-to': toColorValue(value, 'to'),
            },
          ],
        ]
      },
    ],
  })
}