<template>
  <table id="tablero">
    <tbody>
      <tr v-for="row in 8" :key="row">
        <th>{{ 9 - row }}</th>
        <td
          v-for="col in 8"
          :key="col"
          :id="getSquareId(col, 9 - row)"
          :class="[
            getSquareColor(col, row),
            { 'dropable': isDroppable(getSquareId(col, 9 - row)) },
            { 'final': isTargetSquare(getSquareId(col, 9 - row)) }
          ]"
          @dragover.prevent
          @drop="handleDrop"
        >
          <img
            v-if="isHorseHere(getSquareId(col, 9 - row))"
            id="caballo"
            src="@/assets/images/caballo.png"
            width="50"
            draggable="true"
            @dragstart="handleDragStart"
          />
        </td>
      </tr>
      <tr>
        <th></th>
        <th v-for="col in 8" :key="col">{{ rowName[col - 1] }}</th>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
  name: 'ChessBoard',
  props: {
    initialPosition: {
      type: String,
      required: true
    },
    gameMovements: {
      type: Number,
      required: true
    }
  },
  emits: ['movement', 'game-won', 'target-updated'],
  setup(props, { emit }) {
    const rowName = 'ABCDEFGH'
    const horsePosition = ref(props.initialPosition)
    const targetPosition = ref('')
    const validMoves = ref([])

    const getSquareId = (col, row) => {
      return rowName[col - 1] + row
    }

    const getSquareColor = (col, row) => {
      return (col + row) % 2 ? 'negra' : 'blanca'
    }

    const isHorseHere = (squareId) => {
      return squareId === horsePosition.value
    }

    const isDroppable = (squareId) => {
      return validMoves.value.includes(squareId)
    }

    const isTargetSquare = (squareId) => {
      return squareId === targetPosition.value
    }

    const calcTargets = (position) => {
      const column = rowName.indexOf(position.charAt(0)) + 1
      const row = Number(position.charAt(1))
      let targets = [
        [column + 2, row + 1],
        [column + 2, row - 1],
        [column - 2, row + 1],
        [column - 2, row - 1],
        [column + 1, row + 2],
        [column + 1, row - 2],
        [column - 1, row + 2],
        [column - 1, row - 2]
      ]
      return clearTargets(targets).map(cell => rowName.charAt(cell[0] - 1) + cell[1])
    }

    const clearTargets = (targets) => {
      return targets.filter(cell => {
        const column = cell[0]
        const row = cell[1]
        return column >= 1 && column <= 8 && row >= 1 && row <= 8
      })
    }

    const getRandomPosition = () => {
      const row = Math.floor(Math.random() * 8) + 1
      const col = Math.floor(Math.random() * 8)
      const position = rowName.charAt(col) + row
      if (position === horsePosition.value) {
        return getRandomPosition()
      }
      return position
    }

    const handleDragStart = (event) => {
      event.dataTransfer.setData('text/plain', event.target.id)
    }

    const handleDrop = (event) => {
      event.preventDefault()
      const targetId = event.target.id || event.target.parentElement.id
      
      if (!validMoves.value.includes(targetId)) return
      
      horsePosition.value = targetId
      emit('movement')
      
      if (targetId === targetPosition.value) {
        emit('game-won')
        resetGame()
      } else {
        updateValidMoves()
      }
    }

    const updateValidMoves = () => {
      validMoves.value = calcTargets(horsePosition.value)
    }

    const resetGame = () => {
      horsePosition.value = props.initialPosition
      targetPosition.value = getRandomPosition()
      emit('target-updated', targetPosition.value)
      updateValidMoves()
    }

    onMounted(() => {
      resetGame()
    })

    watch(() => props.gameMovements, (newValue) => {
      if (newValue === 0) {
        resetGame()
      }
    })

    return {
      rowName,
      horsePosition,
      targetPosition,
      validMoves,
      getSquareId,
      getSquareColor,
      isHorseHere,
      isDroppable,
      isTargetSquare,
      handleDragStart,
      handleDrop
    }
  }
}
</script>
