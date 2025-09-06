'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Heart, Sword, Shield } from 'lucide-react'

interface DragonbornGameProps {
  onGameComplete: (result: any) => void
  onClose: () => void
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  isJumping: boolean
  isGrounded: boolean
  health: number
  maxHealth: number
  isAttacking: boolean
  isBlocking: boolean
  direction: 'left' | 'right'
  attackCooldown: number
  blockCooldown: number
  invulnerable: number
}

interface Enemy {
  id: number
  x: number
  y: number
  width: number
  height: number
  health: number
  maxHealth: number
  type: 'goblin' | 'orc' | 'troll' | 'dragon' | 'skeleton' | 'wraith'
  velocityX: number
  velocityY: number
  isAlive: boolean
  lastAttack: number
  attackPattern: string
  patrolStart: number
  patrolEnd: number
  isGrounded: boolean
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
  type: 'ground' | 'platform' | 'spike' | 'lava'
}

interface Projectile {
  id: number
  x: number
  y: number
  velocityX: number
  velocityY: number
  type: 'fireball' | 'arrow'
  damage: number
}

interface Level {
  id: number
  name: string
  background: string
  platforms: Platform[]
  enemies: Omit<Enemy, 'id' | 'isAlive' | 'lastAttack' | 'isGrounded'>[]
  story: string
  boss?: boolean
  spawnX: number
  spawnY: number
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: 'The Cursed Dark Forest',
    background: 'forest',
    spawnX: 50,
    spawnY: 300,
    story: 'Long ago, a prophecy foretold of a knight born to slay the ancient dragon. You are that knight. Your journey begins in the cursed Dark Forest, where twisted creatures lurk in every shadow...',
    platforms: [
      // Ground platforms
      { x: 0, y: 380, width: 200, height: 120, type: 'ground' },
      { x: 200, y: 400, width: 150, height: 100, type: 'ground' },
      { x: 350, y: 380, width: 200, height: 120, type: 'ground' },
      { x: 550, y: 360, width: 100, height: 140, type: 'ground' },
      { x: 650, y: 380, width: 250, height: 120, type: 'ground' },
      
      // Elevated platforms
      { x: 250, y: 320, width: 80, height: 20, type: 'platform' },
      { x: 450, y: 280, width: 100, height: 20, type: 'platform' },
      { x: 700, y: 300, width: 80, height: 20, type: 'platform' },
      
      // Hazards
      { x: 380, y: 360, width: 40, height: 20, type: 'spike' },
      { x: 580, y: 340, width: 60, height: 20, type: 'spike' }
    ],
    enemies: [
      { x: 250, y: 285, width: 35, height: 35, health: 2, maxHealth: 2, type: 'goblin', velocityX: -1, velocityY: 0, attackPattern: 'melee', patrolStart: 200, patrolEnd: 350 },
      { x: 500, y: 245, width: 35, height: 35, health: 2, maxHealth: 2, type: 'skeleton', velocityX: 1, velocityY: 0, attackPattern: 'ranged', patrolStart: 450, patrolEnd: 550 },
      { x: 650, y: 345, width: 45, height: 45, type: 'orc', health: 2, maxHealth: 2, velocityX: -0.8, velocityY: 0, attackPattern: 'charge', patrolStart: 600, patrolEnd: 750 },
      { x: 750, y: 265, width: 30, height: 30, health: 2, maxHealth: 2, type: 'goblin', velocityX: -1.2, velocityY: 0, attackPattern: 'jump', patrolStart: 700, patrolEnd: 800 }
    ]
  },
  {
    id: 2,
    name: 'The Treacherous Mountain Pass',
    background: 'mountain',
    spawnX: 50,
    spawnY: 250,
    story: 'Having survived the dark forest, you now face the perilous mountain pass. Ancient magic flows through these peaks, and the creatures here are far more dangerous. The dragon\'s presence grows stronger...',
    platforms: [
      // Complex terrain with gaps and elevation changes
      { x: 0, y: 300, width: 120, height: 200, type: 'ground' },
      { x: 180, y: 350, width: 100, height: 150, type: 'ground' },
      { x: 340, y: 320, width: 80, height: 180, type: 'ground' },
      { x: 480, y: 280, width: 120, height: 220, type: 'ground' },
      { x: 660, y: 340, width: 100, height: 160, type: 'ground' },
      { x: 820, y: 300, width: 80, height: 200, type: 'ground' },
      
      // Floating platforms
      { x: 140, y: 280, width: 60, height: 15, type: 'platform' },
      { x: 300, y: 240, width: 80, height: 15, type: 'platform' },
      { x: 420, y: 200, width: 100, height: 15, type: 'platform' },
      { x: 580, y: 220, width: 80, height: 15, type: 'platform' },
      { x: 780, y: 240, width: 60, height: 15, type: 'platform' },
      
      // Hazards
      { x: 280, y: 300, width: 60, height: 20, type: 'spike' },
      { x: 600, y: 320, width: 60, height: 20, type: 'spike' },
      { x: 760, y: 280, width: 40, height: 20, type: 'lava' }
    ],
    enemies: [
      { x: 180, y: 315, width: 40, height: 40, type: 'orc', health: 4, maxHealth: 4, velocityX: -1, velocityY: 0, attackPattern: 'melee', patrolStart: 150, patrolEnd: 280 },
      { x: 300, y: 205, width: 35, height: 35, health: 4, maxHealth: 4, type: 'skeleton', velocityX: 0.8, velocityY: 0, attackPattern: 'ranged', patrolStart: 280, patrolEnd: 380 },
      { x: 480, y: 245, width: 50, height: 50, type: 'troll', health: 4, maxHealth: 4, velocityX: -0.5, velocityY: 0, attackPattern: 'charge', patrolStart: 450, patrolEnd: 600 },
      { x: 660, y: 305, width: 30, height: 30, health: 4, maxHealth: 4, type: 'wraith', velocityX: 1.5, velocityY: 0, attackPattern: 'melee', patrolStart: 620, patrolEnd: 760 },
      { x: 820, y: 265, width: 35, height: 35, health: 4, maxHealth: 4, type: 'goblin', velocityX: -1.5, velocityY: 0, attackPattern: 'jump', patrolStart: 800, patrolEnd: 900 }
    ]
  },
  {
    id: 3,
    name: 'The Ancient Dragon\'s Lair',
    background: 'lair',
    spawnX: 50,
    spawnY: 350,
    story: 'At last, you stand before the ancient dragon\'s lair. The air crackles with dark magic, and the ground trembles with each breath of the beast. This is your destiny - defeat the dragon and fulfill the prophecy that has guided your entire life!',
    boss: true,
    platforms: [
      // Arena-style layout for boss fight
      { x: 0, y: 400, width: 200, height: 100, type: 'ground' },
      { x: 200, y: 420, width: 500, height: 80, type: 'ground' },
      { x: 700, y: 400, width: 200, height: 100, type: 'ground' },
      
      // Elevated platforms for tactical positioning
      { x: 150, y: 320, width: 100, height: 20, type: 'platform' },
      { x: 350, y: 280, width: 200, height: 20, type: 'platform' },
      { x: 650, y: 320, width: 100, height: 20, type: 'platform' },
      
      // Hazards that activate during dragon fight
      { x: 250, y: 400, width: 50, height: 20, type: 'lava' },
      { x: 450, y: 400, width: 50, height: 20, type: 'lava' },
      { x: 650, y: 400, width: 50, height: 20, type: 'lava' }
    ],
    enemies: [
      // The Ancient Dragon Boss
      { 
        x: 400, 
        y: 200, 
        width: 150, 
        height: 120, 
        type: 'dragon', 
        health: 15, 
        maxHealth: 15, 
        velocityX: 0, 
        velocityY: 0, 
        attackPattern: 'boss', 
        patrolStart: 300, 
        patrolEnd: 600 
      }
    ]
  }
]

const ENEMY_SPRITES = {
  goblin: '👹',
  orc: '👺',
  troll: '👿',
  dragon: '🐉',
  skeleton: '💀',
  wraith: '👻'
}

const PLATFORM_COLORS = {
  ground: '#8B4513',
  platform: '#654321',
  spike: '#FF4444',
  lava: '#FF6600'
}

export default function DragonbornGame({ onGameComplete, onClose }: DragonbornGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'gameOver'>('story')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: 300,
    width: 35,
    height: 35,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    isGrounded: false,
    health: 8,
    maxHealth: 8,
    isAttacking: false,
    isBlocking: false,
    direction: 'right',
    attackCooldown: 0,
    blockCooldown: 0,
    invulnerable: 0
  })
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [keys, setKeys] = useState<{[key: string]: boolean}>({})
  const [gameTime, setGameTime] = useState(0)
  const [cameraX, setCameraX] = useState(0)
  const [levelInitialized, setLevelInitialized] = useState(false)

  const CANVAS_WIDTH = 1000
  const CANVAS_HEIGHT = 500
  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const PLAYER_SPEED = 5
  const WORLD_WIDTH = 900

  // Initialize level
  useEffect(() => {
    if (gameState === 'playing') {
      setLevelInitialized(false)
      const level = LEVELS[currentLevel]
      
      const levelEnemies = level.enemies.map((enemy, index) => ({
        ...enemy,
        id: index,
        isAlive: true,
        lastAttack: 0,
        isGrounded: false,
        velocityX: enemy.velocityX || (Math.random() > 0.5 ? 1 : -1), // Ensure enemies have initial velocity
        velocityY: enemy.velocityY || 0
      }))
      setEnemies(levelEnemies)
      setProjectiles([])
      setGameTime(0)
      setPlayer(prev => ({ 
        ...prev, 
        x: level.spawnX, 
        y: level.spawnY, 
        health: prev.maxHealth,
        velocityX: 0,
        velocityY: 0,
        attackCooldown: 0,
        blockCooldown: 0,
        invulnerable: 0,
        isAttacking: false,
        isBlocking: false
      }))
      setCameraX(0)
      
      // Mark level as initialized after a short delay
      setTimeout(() => {
        setLevelInitialized(true)
      }, 100)
    }
  }, [currentLevel, gameState])

  // Single consolidated game loop
  useEffect(() => {
    if (gameState !== 'playing' || !levelInitialized) return

    const gameLoop = setInterval(() => {
      setGameTime(prev => prev + 1)
      
      // Update player
      setPlayer(prevPlayer => {
        let newPlayer = { ...prevPlayer }
        
        // Decrease cooldowns and invulnerability
        newPlayer.attackCooldown = Math.max(0, newPlayer.attackCooldown - 1)
        newPlayer.blockCooldown = Math.max(0, newPlayer.blockCooldown - 1)
        newPlayer.invulnerable = Math.max(0, newPlayer.invulnerable - 1)

        // Horizontal movement
        newPlayer.velocityX = 0
        if (keys['a'] || keys['arrowleft']) {
          newPlayer.velocityX = -PLAYER_SPEED
          newPlayer.direction = 'left'
        }
        if (keys['d'] || keys['arrowright']) {
          newPlayer.velocityX = PLAYER_SPEED
          newPlayer.direction = 'right'
        }

        // Apply horizontal movement
        newPlayer.x += newPlayer.velocityX
        newPlayer.x = Math.max(0, Math.min(WORLD_WIDTH - newPlayer.width, newPlayer.x))

        // Jumping
        if ((keys['w'] || keys['arrowup'] || keys[' ']) && !newPlayer.isJumping) {
          newPlayer.velocityY = JUMP_FORCE
          newPlayer.isJumping = true
          newPlayer.isGrounded = false
        }

        // Attacking - 2 second cooldown (120 frames at 60fps)
        if ((keys['j'] || keys['enter']) && newPlayer.attackCooldown === 0) {
          newPlayer.isAttacking = true
          newPlayer.attackCooldown = 120
          newPlayer.isBlocking = false
        } else if (newPlayer.attackCooldown < 110) {
          newPlayer.isAttacking = false
        }

        // Blocking - 4 second cooldown (240 frames at 60fps) after successful block
        if ((keys['k'] || keys['shift']) && newPlayer.blockCooldown === 0) {
          newPlayer.isBlocking = true
          newPlayer.isAttacking = false
        } else if (newPlayer.blockCooldown > 0) {
          newPlayer.isBlocking = false
        }

        // Apply gravity
        newPlayer.velocityY += GRAVITY
        newPlayer.y += newPlayer.velocityY
        newPlayer.isGrounded = false

        // Platform collisions
        const level = LEVELS[currentLevel]
        const platformResult = checkPlatformCollision(newPlayer, level.platforms)
        if (platformResult.collision && platformResult.damage > 0 && newPlayer.invulnerable === 0) {
          newPlayer.health = Math.max(0, newPlayer.health - platformResult.damage)
          newPlayer.invulnerable = 60
        }

        // Prevent falling off the world
        if (newPlayer.y > CANVAS_HEIGHT) {
          newPlayer.health = 0
        }

        return newPlayer
      })

      // Update enemies (simplified AI) - using current player state
      setPlayer(currentPlayer => {
        setEnemies(prevEnemies => {
          return prevEnemies.map(enemy => {
            if (!enemy.isAlive) return enemy

            let newEnemy = { ...enemy }
            
            // Simple AI - move toward player at normal speed
            if (Math.abs(currentPlayer.x - enemy.x) > 30) {
              newEnemy.velocityX = currentPlayer.x > enemy.x ? 2 : -2
            } else {
              newEnemy.velocityX = 0
            }

            // Apply movement
            newEnemy.x += newEnemy.velocityX
            newEnemy.x = Math.max(0, Math.min(WORLD_WIDTH - enemy.width, newEnemy.x))

            return newEnemy
          })
        })
        return currentPlayer // Return unchanged player
      })

      // Combat and level completion - using current player state
      setPlayer(currentPlayer => {
        setEnemies(prevEnemies => {
          const updatedEnemies = prevEnemies.map(enemy => {
            if (!enemy.isAlive) return enemy

            // Player attacking enemy
            if (currentPlayer.isAttacking && currentPlayer.attackCooldown > 110) {
              const distance = Math.abs(currentPlayer.x - enemy.x)
              const verticalDistance = Math.abs(currentPlayer.y - enemy.y)
              
              if (distance < 60 && verticalDistance < 50) {
                const newHealth = enemy.health - 1
                
                // Knockback effect
                const knockbackDirection = currentPlayer.x < enemy.x ? 1 : -1
                const knockbackDistance = 40
                const newX = Math.max(0, Math.min(WORLD_WIDTH - enemy.width, 
                  enemy.x + (knockbackDirection * knockbackDistance)))
                
                if (newHealth <= 0) {
                  const points = enemy.type === 'dragon' ? 200 : 
                               enemy.type === 'troll' ? 50 :
                               enemy.type === 'orc' ? 30 : 20
                  setScore(prev => prev + points)
                  return { ...enemy, health: 0, isAlive: false, x: newX }
                }
                return { ...enemy, health: newHealth, x: newX }
              }
            }

            // Enemy attacks player
            const distance = Math.abs(currentPlayer.x - enemy.x)
            const verticalDistance = Math.abs(currentPlayer.y - enemy.y)
            
            if (distance < 45 && verticalDistance < 40 && currentPlayer.invulnerable === 0) {
              const damage = enemy.type === 'dragon' ? 3 : 
                            enemy.type === 'troll' ? 2 : 1
              
              // Check if player is blocking
              if (currentPlayer.isBlocking) {
                // Successful block - trigger cooldown
                setPlayer(prev => ({
                  ...prev,
                  blockCooldown: 240, // 4 second cooldown
                  isBlocking: false
                }))

              } else {
                // Take damage
                setPlayer(prev => ({
                  ...prev,
                  health: Math.max(0, prev.health - damage),
                  invulnerable: 60
                }))
              }
            }

            return enemy
          })

          // Check if level is complete
          const stillAlive = updatedEnemies.filter(e => e.isAlive)
          if (stillAlive.length === 0 && updatedEnemies.length > 0) {
            setTimeout(() => {
              if (currentLevel === LEVELS.length - 1) {
                setGameState('gameComplete')
              } else {
                setGameState('levelComplete')
              }
            }, 1000)
          }

          return updatedEnemies
        })

        // Check game over
        if (currentPlayer.health <= 0) {
          setGameState('gameOver')
        }

        return currentPlayer // Return unchanged player
      })
      
    }, 1000 / 60) // 60 FPS

    return () => clearInterval(gameLoop)
  }, [gameState, levelInitialized, keys, currentLevel])


  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Collision detection helper
  const checkCollision = (rect1: any, rect2: any) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y
  }

  // Platform collision helper
  const checkPlatformCollision = (entity: any, platforms: Platform[]) => {
    for (const platform of platforms) {
      if (checkCollision(entity, platform)) {
        // Landing on top of platform
        if (entity.velocityY > 0 && entity.y < platform.y) {
          entity.y = platform.y - entity.height
          entity.velocityY = 0
          entity.isJumping = false
          entity.isGrounded = true
          
          // Handle hazards
          if (platform.type === 'spike' || platform.type === 'lava') {
            return { collision: true, damage: platform.type === 'lava' ? 2 : 1 }
          }
          return { collision: true, damage: 0 }
        }
        // Side collisions
        else if (entity.velocityX !== 0) {
          if (entity.x < platform.x) {
            entity.x = platform.x - entity.width
          } else {
            entity.x = platform.x + platform.width
          }
          entity.velocityX = 0
          return { collision: true, damage: 0 }
        }
      }
    }
    return { collision: false, damage: 0 }
  }



  // Advanced rendering system
  useEffect(() => {
    if (gameState !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const level = LEVELS[currentLevel]

    // Save context for camera transform
    ctx.save()
    ctx.translate(-cameraX, 0)

    // Draw background based on level
    const drawBackground = () => {
      switch (level.background) {
        case 'forest':
          // Dark forest background
          const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
          gradient.addColorStop(0, '#1a1a2e')
          gradient.addColorStop(0.7, '#16213e')
          gradient.addColorStop(1, '#0f3460')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, WORLD_WIDTH, CANVAS_HEIGHT)
          
          // Trees
          ctx.font = '80px Arial'
          for (let i = 0; i < WORLD_WIDTH; i += 120) {
            ctx.fillText('🌲', i, 100 + Math.sin(i * 0.01) * 20)
          }
          break
          
        case 'mountain':
          // Mountain background
          const mountainGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
          mountainGradient.addColorStop(0, '#4a5568')
          mountainGradient.addColorStop(0.5, '#2d3748')
          mountainGradient.addColorStop(1, '#1a202c')
          ctx.fillStyle = mountainGradient
          ctx.fillRect(0, 0, WORLD_WIDTH, CANVAS_HEIGHT)
          
          // Mountains
          ctx.font = '100px Arial'
          for (let i = 0; i < WORLD_WIDTH; i += 200) {
            ctx.fillText('⛰️', i, 150)
          }
          break
          
        case 'lair':
          // Dragon lair background
          const lairGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
          lairGradient.addColorStop(0, '#2d1b69')
          lairGradient.addColorStop(0.5, '#1a1a2e')
          lairGradient.addColorStop(1, '#000000')
          ctx.fillStyle = lairGradient
          ctx.fillRect(0, 0, WORLD_WIDTH, CANVAS_HEIGHT)
          
          // Lair elements
          ctx.font = '60px Arial'
          ctx.fillText('🏰', 400, 100)
          ctx.font = '40px Arial'
          for (let i = 0; i < WORLD_WIDTH; i += 150) {
            ctx.fillText('🔥', i, 120 + Math.sin(gameTime * 0.1 + i) * 10)
          }
          break
      }
    }

    drawBackground()

    // Draw platforms with better graphics
    level.platforms.forEach(platform => {
      ctx.fillStyle = PLATFORM_COLORS[platform.type]
      
      if (platform.type === 'lava') {
        // Animated lava
        ctx.fillStyle = `hsl(${15 + Math.sin(gameTime * 0.1) * 10}, 100%, 50%)`
      } else if (platform.type === 'spike') {
        // Spikes
        ctx.fillStyle = '#8B0000'
      }
      
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
      
      // Add texture/details
      if (platform.type === 'ground') {
        ctx.fillStyle = '#654321'
        ctx.fillRect(platform.x, platform.y, platform.width, 5)
      } else if (platform.type === 'spike') {
        // Draw spike points
        ctx.fillStyle = '#FF0000'
        for (let x = platform.x; x < platform.x + platform.width; x += 10) {
          ctx.beginPath()
          ctx.moveTo(x, platform.y + platform.height)
          ctx.lineTo(x + 5, platform.y)
          ctx.lineTo(x + 10, platform.y + platform.height)
          ctx.fill()
        }
      }
    })

    // Draw projectiles
    projectiles.forEach(projectile => {
      ctx.font = '20px Arial'
      const sprite = projectile.type === 'fireball' ? '🔥' : '🏹'
      ctx.fillText(sprite, projectile.x, projectile.y + 20)
    })

    // Draw enemies with better graphics
    enemies.forEach(enemy => {
      if (enemy.isAlive) {
        const sprite = ENEMY_SPRITES[enemy.type]
        const size = enemy.type === 'dragon' ? '120px' : 
                    enemy.type === 'troll' ? '50px' : '35px'
        
        ctx.font = `${size} Arial`
        
        // Flashing effect when damaged
        if (gameTime - enemy.lastAttack < 10) {
          ctx.filter = 'hue-rotate(180deg)'
        }
        
        ctx.fillText(sprite, enemy.x, enemy.y + enemy.height)
        ctx.filter = 'none'
        
        // Enhanced health bar
        if (enemy.health < enemy.maxHealth) {
          const barWidth = enemy.width
          const barHeight = 8
          const barY = enemy.y - 20
          
          // Background
          ctx.fillStyle = '#000000'
          ctx.fillRect(enemy.x - 2, barY - 2, barWidth + 4, barHeight + 4)
          
          // Red background
          ctx.fillStyle = '#ff0000'
          ctx.fillRect(enemy.x, barY, barWidth, barHeight)
          
          // Green health
          ctx.fillStyle = '#00ff00'
          ctx.fillRect(enemy.x, barY, (enemy.health / enemy.maxHealth) * barWidth, barHeight)
          
          // Health text
          ctx.font = '12px Arial'
          ctx.fillStyle = '#ffffff'
          ctx.fillText(`${enemy.health}/${enemy.maxHealth}`, enemy.x, barY - 5)
        }
      }
    })

    // Draw player with enhanced graphics and proper direction
    ctx.font = '35px Arial'
    let playerSprite = '🧙‍♂️'
    
    if (player.isBlocking) {
      playerSprite = '🛡️'
    } else if (player.isAttacking) {
      playerSprite = '⚔️'
    } else if (player.isJumping) {
      playerSprite = '🤸'
    } else if (player.velocityX !== 0) {
      playerSprite = '🏃'
    } else {
      playerSprite = '🧙‍♂️' // Standing knight
    }
    
    // Invulnerability flashing
    if (player.invulnerable > 0 && Math.floor(gameTime / 5) % 2) {
      ctx.filter = 'opacity(0.5)'
    }
    
    // Draw sprite with proper direction
    if (player.direction === 'left') {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.fillText(playerSprite, -player.x - player.width, player.y + player.height)
      ctx.restore()
    } else {
      ctx.fillText(playerSprite, player.x, player.y + player.height)
    }
    
    ctx.filter = 'none'

    // Restore context
    ctx.restore()

    // Draw UI (not affected by camera)
    ctx.font = '20px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    
    // Health display
    const healthText = `Health: ${'❤️'.repeat(player.health)}${'🖤'.repeat(player.maxHealth - player.health)}`
    ctx.strokeText(healthText, 20, 30)
    ctx.fillText(healthText, 20, 30)
    
    // Score
    ctx.strokeText(`Score: ${score}`, 20, 60)
    ctx.fillText(`Score: ${score}`, 20, 60)
    
    // Level
    ctx.strokeText(`${level.name}`, 20, 90)
    ctx.fillText(`${level.name}`, 20, 90)
    
    // Cooldown indicators
    if (player.attackCooldown > 0) {
      const cooldownText = `Attack: ${Math.ceil(player.attackCooldown / 60)}s`
      ctx.fillStyle = '#ff6666'
      ctx.strokeText(cooldownText, 20, 120)
      ctx.fillText(cooldownText, 20, 120)
    }
    
    if (player.blockCooldown > 0) {
      const cooldownText = `Block: ${Math.ceil(player.blockCooldown / 60)}s`
      ctx.fillStyle = '#6666ff'
      ctx.strokeText(cooldownText, 20, 140)
      ctx.fillText(cooldownText, 20, 140)
    }
    
    // Controls
    ctx.font = '14px Arial'
    ctx.fillStyle = '#cccccc'
    ctx.fillText('WASD/Arrows: Move | Space: Jump | J/Enter: Attack | K/Shift: Block', 20, CANVAS_HEIGHT - 20)
    
    // Boss health bar (for dragon fight)
    const dragon = enemies.find(e => e.type === 'dragon' && e.isAlive)
    if (dragon) {
      const bossBarWidth = CANVAS_WIDTH - 100
      const bossBarHeight = 20
      const bossBarX = 50
      const bossBarY = 50
      
      ctx.fillStyle = '#000000'
      ctx.fillRect(bossBarX - 2, bossBarY - 2, bossBarWidth + 4, bossBarHeight + 4)
      
      ctx.fillStyle = '#8B0000'
      ctx.fillRect(bossBarX, bossBarY, bossBarWidth, bossBarHeight)
      
      ctx.fillStyle = '#FF4500'
      ctx.fillRect(bossBarX, bossBarY, (dragon.health / dragon.maxHealth) * bossBarWidth, bossBarHeight)
      
      ctx.font = '16px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.strokeText('🐉 Ancient Dragon', bossBarX, bossBarY - 5)
      ctx.fillText('🐉 Ancient Dragon', bossBarX, bossBarY - 5)
    }
    
  }, [player, enemies, projectiles, score, currentLevel, gameState, gameTime, cameraX])

  const startLevel = () => {
    setGameState('playing')
  }

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1)
    setGameState('story')
  }

  const restartGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setPlayer({
      x: 50,
      y: 350,
      width: 40,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      isJumping: false,
      isGrounded: false,
      health: 8,
      maxHealth: 8,
      isAttacking: false,
      isBlocking: false,
      direction: 'right',
      attackCooldown: 0,
      blockCooldown: 0,
      invulnerable: 0
    })
    setGameTime(0)
    setGameState('story')
  }

  const handleGameComplete = () => {
    const finalScore = score + (player.health * 10)
    const result = {
      score: finalScore,
      maxScore: 300,
      accuracy: finalScore / 300,
      bonusXP: Math.floor(finalScore / 5),
      bonusCoins: Math.floor(finalScore / 10)
    }
    onGameComplete(result)
  }

  if (gameState === 'story') {
    const level = LEVELS[currentLevel]
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-gradient-to-b from-purple-900 to-black text-white rounded-xl p-8 max-w-2xl mx-4 text-center">
          <div className="text-6xl mb-4">🐉</div>
          <h2 className="text-3xl font-bold mb-4">Dragonborn Quest</h2>
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">
            Level {currentLevel + 1}: {level.name}
          </h3>
          <p className="text-lg mb-8 leading-relaxed">
            {level.story}
          </p>
          <div className="flex space-x-4 justify-center">
            <button onClick={startLevel} className="btn-game px-8 py-3">
              Begin Quest
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Retreat
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'levelComplete') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-gradient-to-b from-green-800 to-green-900 text-white rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold mb-4">Level Complete!</h2>
          <p className="text-lg mb-6">
            You have conquered {LEVELS[currentLevel].name}!
          </p>
          <div className="mb-6">
            <div className="text-xl font-bold">Score: {score}</div>
            <div className="text-sm text-green-300">Health Bonus: +{player.health * 10}</div>
          </div>
          <button onClick={nextLevel} className="btn-game w-full">
            Continue Journey
          </button>
        </div>
      </div>
    )
  }

  if (gameState === 'gameComplete') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-gradient-to-b from-yellow-600 to-orange-700 text-white rounded-xl p-8 max-w-lg mx-4 text-center">
          <div className="text-8xl mb-4">👑</div>
          <h2 className="text-3xl font-bold mb-4">VICTORY!</h2>
          <p className="text-xl mb-6">
            The prophecy is fulfilled! You have slain the ancient dragon and saved the realm!
          </p>
          <div className="mb-6 p-4 bg-black bg-opacity-30 rounded-lg">
            <div className="text-2xl font-bold mb-2">Final Score: {score + (player.health * 10)}</div>
            <div className="text-sm">
              <div>Combat Score: {score}</div>
              <div>Health Bonus: +{player.health * 10}</div>
              <div className="text-yellow-300">XP Earned: +{Math.floor((score + player.health * 10) / 5)}</div>
              <div className="text-yellow-300">Coins Earned: +{Math.floor((score + player.health * 10) / 10)}</div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button onClick={handleGameComplete} className="flex-1 btn-game">
              Claim Rewards
            </button>
            <button onClick={restartGame} className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Play Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'gameOver') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-gradient-to-b from-red-800 to-red-900 text-white rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-2xl font-bold mb-4">Quest Failed</h2>
          <p className="text-lg mb-6">
            The knight has fallen... but legends never truly die.
          </p>
          <div className="mb-6">
            <div className="text-xl">Score: {score}</div>
          </div>
          <div className="flex space-x-3">
            <button onClick={restartGame} className="flex-1 btn-game">
              Rise Again
            </button>
            <button onClick={onClose} className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Retreat
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl p-2 sm:p-4 w-full max-w-6xl">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">🐉 Dragonborn Quest</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors text-white touch-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mobile-game-canvas">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-600 rounded-lg bg-sky-200 w-full h-auto max-w-full"
            style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
          />
        </div>
        
        {/* Mobile Touch Controls */}
        <div className="mt-2 sm:mt-4">
          <div className="block sm:hidden">
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
              <div></div>
              <button 
                className="bg-gray-700 text-white p-3 rounded-lg touch-button"
                onTouchStart={() => setKeys(prev => ({ ...prev, 'w': true }))}
                onTouchEnd={() => setKeys(prev => ({ ...prev, 'w': false }))}
              >
                ↑
              </button>
              <button 
                className="bg-red-600 text-white p-3 rounded-lg touch-button"
                onTouchStart={() => setKeys(prev => ({ ...prev, 'j': true }))}
                onTouchEnd={() => setKeys(prev => ({ ...prev, 'j': false }))}
              >
                ⚔️
              </button>
              <button 
                className="bg-blue-600 text-white p-3 rounded-lg touch-button"
                onTouchStart={() => setKeys(prev => ({ ...prev, 'k': true }))}
                onTouchEnd={() => setKeys(prev => ({ ...prev, 'k': false }))}
              >
                🛡️
              </button>
              
              <button 
                className="bg-gray-700 text-white p-3 rounded-lg touch-button"
                onTouchStart={() => setKeys(prev => ({ ...prev, 'a': true }))}
                onTouchEnd={() => setKeys(prev => ({ ...prev, 'a': false }))}
              >
                ←
              </button>
              <button 
                className="bg-gray-700 text-white p-3 rounded-lg touch-button"
                onTouchStart={() => setKeys(prev => ({ ...prev, 's': true }))}
                onTouchEnd={() => setKeys(prev => ({ ...prev, 's': false }))}
              >
                ↓
              </button>
              <button 
                className="bg-gray-700 text-white p-3 rounded-lg touch-button"
                onTouchStart={() => setKeys(prev => ({ ...prev, 'd': true }))}
                onTouchEnd={() => setKeys(prev => ({ ...prev, 'd': false }))}
              >
                →
              </button>
            </div>
          </div>
          
          <div className="text-center text-white text-xs sm:text-sm">
            <p className="hidden sm:block">Use WASD or Arrow Keys to move • J or Enter to attack • K or Shift to block</p>
            <p className="sm:hidden">Use touch controls to move, attack, and block</p>
            <p className="text-yellow-400">Fulfill your destiny as the Dragonborn!</p>
          </div>
        </div>
      </div>
    </div>
  )
}