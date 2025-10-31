import { Zap, Trophy, Coins, Target, Users } from 'lucide-react'

export default function MonsterPlayPage() {
  const games = [
    {
      name: 'Monster Dash',
      desc: 'Endless runner. Answer questions to boost speed.',
      icon: '🏃',
      actions: ['Play', 'Learn Mode']
    },
    {
      name: 'Quiz Arena',
      desc: 'Battle LM or friends in fast rounds.',
      icon: '⚔️',
      actions: ['Play', 'Challenge LM']
    },
    {
      name: 'Flashcard Race',
      desc: 'Rapid taps to beat the clock.',
      icon: '⚡',
      actions: ['Start']
    },
    {
      name: '2048: Knowledge Mode',
      desc: 'Merge tiles; answer to double points.',
      icon: '🎯',
      actions: ['Play']
    }
  ]

  const progress = {
    xp: 230,
    coins: 48,
    highScore: 9870,
    level: 12
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Monster Play 🎮</h1>
        <p className="text-gray-600">Play games that reinforce your notes with quick questions</p>
      </div>

      {/* Progress Card */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Your Progress</h2>
          <div className="text-2xl">😈</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{progress.xp}</div>
            <div className="text-xs text-gray-600">XP Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">🪙 {progress.coins}</div>
            <div className="text-xs text-gray-600">LM Coins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">🔥 {progress.highScore}</div>
            <div className="text-xs text-gray-600">High Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Level {progress.level}</div>
            <div className="text-xs text-gray-600">Monster Level</div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div key={game.name} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">{game.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{game.name}</h3>
                <p className="text-sm text-gray-600">{game.desc}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {game.actions.map((action) => (
                <button
                  key={action}
                  className="flex-1 px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Today's Leaderboard
        </h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'You (Ella)', score: 9870, badge: '🥇' },
            { rank: 2, name: 'Sarah J.', score: 9650, badge: '🥈' },
            { rank: 3, name: 'Mike C.', score: 9420, badge: '🥉' },
            { rank: 4, name: 'Emma D.', score: 8990, badge: '' },
            { rank: 5, name: 'Alex M.', score: 8750, badge: '' },
          ].map((player) => (
            <div
              key={player.rank}
              className={`flex items-center gap-4 p-3 rounded-xl ${
                player.rank === 1 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
              }`}
            >
              <div className="text-lg font-bold w-8">
                {player.badge || `#${player.rank}`}
              </div>
              <div className="flex-1">
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-gray-600">{player.score} pts</div>
              </div>
              {player.rank === 1 && (
                <div className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Top Player
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Info */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🪙</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Earn LM Coins</h3>
            <p className="text-sm text-gray-700 mb-3">
              Play games, answer questions correctly, and complete challenges to earn LM Coins. Use them to unlock special features!
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ 1 Coin per correct answer</li>
              <li>✓ 5 Coins for winning a game</li>
              <li>✓ 10 Coins for daily streak bonus</li>
              <li>✓ Unlock custom LM accessories with coins!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
