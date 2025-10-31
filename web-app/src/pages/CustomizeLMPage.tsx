import { useState } from 'react'
import { Palette, Sparkles, Heart, Star, Zap } from 'lucide-react'

export default function CustomizeLMPage() {
  const [theme, setTheme] = useState({
    baseColor: '#F06292',
    accentColor: '#B39DDB',
    glow: 'neon',
    necklace: 'heart'
  })

  const colorSwatches = [
    { name: 'Pink', hex: '#F06292' },
    { name: 'Rose', hex: '#FF62B0' },
    { name: 'Lavender', hex: '#B39DDB' },
    { name: 'Mint', hex: '#6EE7B7' },
    { name: 'Teal', hex: '#2DD4BF' },
    { name: 'Gold', hex: '#FACC15' },
    { name: 'Ink', hex: '#1F1D29' },
  ]

  const glowOptions = [
    { value: 'none', label: 'None' },
    { value: 'soft', label: 'Soft' },
    { value: 'neon', label: 'Neon' },
  ]

  const necklaceOptions = [
    { value: 'heart', label: 'Heart', icon: '❤️' },
    { value: 'star', label: 'Star', icon: '⭐' },
    { value: 'bolt', label: 'Bolt', icon: '⚡' },
    { value: 'initials', label: 'Initials', icon: 'LM' },
  ]

  const getNecklaceIcon = () => {
    const option = necklaceOptions.find(o => o.value === theme.necklace)
    return option?.icon || '❤️'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Customize LM 💅</h1>
        <p className="text-gray-600">Make LM match your vibe</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Colors Section */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary-600" />
            Colors
          </h2>
          
          {/* Base Color */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-3">Base color</div>
            <div className="flex flex-wrap gap-2">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.name + '-base'}
                  className={`w-10 h-10 rounded-full border-2 hover:scale-110 transition-transform ${
                    theme.baseColor === swatch.hex ? 'ring-2 ring-offset-2 ring-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                  onClick={() => setTheme({ ...theme, baseColor: swatch.hex })}
                />
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <div className="text-sm text-gray-600 mb-3">Accent color</div>
            <div className="flex flex-wrap gap-2">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.name + '-accent'}
                  className={`w-10 h-10 rounded-full border-2 hover:scale-110 transition-transform ${
                    theme.accentColor === swatch.hex ? 'ring-2 ring-offset-2 ring-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                  onClick={() => setTheme({ ...theme, accentColor: swatch.hex })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Style Section */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            Style
          </h2>
          
          {/* Glow Effect */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-3">Glow effect</div>
            <div className="flex gap-2">
              {glowOptions.map((option) => (
                <button
                  key={option.value}
                  className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${
                    theme.glow === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme({ ...theme, glow: option.value })}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Necklace */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-3">Necklace accessory</div>
            <div className="grid grid-cols-2 gap-2">
              {necklaceOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    theme.necklace === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setTheme({ ...theme, necklace: option.value })}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="font-medium text-sm">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="text-sm text-gray-600 mb-3">Preview</div>
            <div className="rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg"
                  style={{
                    backgroundColor: theme.baseColor,
                    boxShadow: theme.glow === 'neon' 
                      ? `0 0 1.2rem ${theme.baseColor}99`
                      : theme.glow === 'soft'
                      ? `0 0 0.6rem ${theme.baseColor}66`
                      : 'none'
                  }}
                >
                  😈
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-lg">
                  {getNecklaceIcon()}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-1">LM reacts live:</div>
                <div className="italic">"Ooo makeover time 👀"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlockables */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔓</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Unlock More Styles</h3>
            <p className="text-sm text-gray-700 mb-3">
              Earn LM Coins by playing Monster Play games to unlock exclusive accessories, colors, and effects!
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl text-center">
                <div className="text-2xl mb-1">👑</div>
                <div className="text-xs font-medium">Crown</div>
                <div className="text-xs text-gray-500">50 coins</div>
              </div>
              <div className="p-3 bg-white rounded-xl text-center">
                <div className="text-2xl mb-1">🎩</div>
                <div className="text-xs font-medium">Top Hat</div>
                <div className="text-xs text-gray-500">75 coins</div>
              </div>
              <div className="p-3 bg-white rounded-xl text-center">
                <div className="text-2xl mb-1">🦋</div>
                <div className="text-xs font-medium">Wings</div>
                <div className="text-xs text-gray-500">100 coins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
