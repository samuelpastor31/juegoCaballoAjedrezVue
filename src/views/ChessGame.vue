<template>
  <div class="main-container">
    <h1 class="main-titulo">Objetivo: <strong id="posicion">{{ targetPosition }}</strong></h1>
    
    <div class="panel-tablero">
      <ChessBoard
        :initial-position="initialPosition"
        :game-movements="gameMovements"
        @movement="handleMovement"
        @game-won="handleGameWon"
        @target-updated="updateTarget"
      />
    </div>

    <div class="panel-score">
      <div class="score">
        <h2 class="data-titulo">Partidas jugadas</h2>
        <span class="data-info" id="played-text">{{ playedGames }}</span> <br>
        <span class="data-info" id="actual-moves">{{ gameMovements }}</span> movimientos actuales
      </div>
      <div class="moves">
        <h2 class="data-titulo">Mejor partida</h2>
        <span class="data-info" id="best-mov-text">{{ betterGame }}</span> movimientos
        <br> (<span class="data-info" id="best-num-text">{{ betterGameQuantity }}</span> veces)
      </div>
      <div class="moves">
        <h2 class="data-titulo">Peor partida</h2>
        <span class="data-info" id="worst-mov-text">{{ worseGame }}</span> movimientos
        <br> (<span class="data-info" id="worst-num-text">{{ worseGameQuantity }}</span> veces)
      </div>
      <div class="buttons">
        <button class="btn-reinicio" @click="clearScore">Borrar marcador</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ChessBoard from '../components/ChessBoard.vue'

export default {
  name: 'ChessGame',
  components: {
    ChessBoard
  },
  setup() {
    const initialPosition = 'D4'
    const targetPosition = ref('')
    const playedGames = ref(0)
    const betterGame = ref(0)
    const betterGameQuantity = ref(0)
    const worseGame = ref(0)
    const worseGameQuantity = ref(0)
    const gameMovements = ref(0)

    const clearScore = () => {
      playedGames.value = 0
      betterGame.value = 0
      betterGameQuantity.value = 0
      worseGame.value = 0
      worseGameQuantity.value = 0
      gameMovements.value = 0
      alert('Marcador borrado')
    }

    const handleMovement = () => {
      gameMovements.value++
    }

    const handleGameWon = () => {
      playedGames.value++
      
      if (gameMovements.value < betterGame.value || betterGame.value === 0) {
        betterGame.value = gameMovements.value
        betterGameQuantity.value = 1
      } else if (gameMovements.value === betterGame.value) {
        betterGameQuantity.value++
      }

      if (gameMovements.value > worseGame.value || worseGame.value === 0) {
        worseGame.value = gameMovements.value
        worseGameQuantity.value = 1
      } else if (gameMovements.value === worseGame.value) {
        worseGameQuantity.value++
      }

      gameMovements.value = 0
    }

    const updateTarget = (position) => {
      targetPosition.value = position
    }

    return {
      initialPosition,
      targetPosition,
      playedGames,
      betterGame,
      betterGameQuantity,
      worseGame,
      worseGameQuantity,
      gameMovements,
      clearScore,
      handleMovement,
      handleGameWon,
      updateTarget
    }
  }
}
</script>
