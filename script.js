const X = "X", O = "O", DRAW = "DRAW";
const EDGE_LENGTH = 3;
const VICTORY_LENGTH = 3;
const NOT_DEEP = { x: -1, y: -1 };
const MAX = { point: Infinity, offset: NOT_DEEP }
const MIN = { point: -Infinity, offset: NOT_DEEP }

const memoryFree = deep => {
   const free = []
   
   for ( let index1 = 0; index1 < EDGE_LENGTH; index1++ ) {
      for ( let index2 = 0; index2 < EDGE_LENGTH; index2++ )
         if ( deep[index1][index2] == null )
            free.push({ x: index2, y: index1 })
   }
   
   return free
}

const checkWin = deep => {
   for ( let y = 0; y < EDGE_LENGTH; y++ ) {
      let countRepeatX = 1;
      for (var x = 0, row = deep[y]; x < EDGE_LENGTH - 1; x++) {
         if ( row[x] != null && row[x] == row[x + 1] )
            countRepeatX++
         else countRepeatX = 1;
         
         if ( countRepeatX == VICTORY_LENGTH )
            return row[x]
      }
      
      let countRepeatY = 1;
      for ( let yDeep = 0, x = y; yDeep < EDGE_LENGTH - 1; yDeep++ ) {
         if ( deep[yDeep][x] != null && deep[yDeep][x] == deep[yDeep + 1][x] )
            countRepeatY++
         else countRepeatY = 1;
         
         if ( countRepeatY == VICTORY_LENGTH )
            return deep[yDeep][x]
      }
   }
   
   let countRepeatCross1 = 1;
   let countRepeatCross2 = 1;
   
   for ( let index1 = 0; index1 <= EDGE_LENGTH - VICTORY_LENGTH; index1 ++ ) {
      for ( let index2 = 0; index2 <= EDGE_LENGTH - VICTORY_LENGTH; index2++ ) {
         
         for ( let index3 = 0; index3 < VICTORY_LENGTH - 1; index3++ ) {
            if ( deep[index1 + index3][index2 + index3] != null && deep[index1 + index3][index2 + index3] == deep[index1 + index3 + 1][index2 + index3 + 1] )
               countRepeatCross1++
            else countRepeatCross1 = 1
            
            if ( countRepeatCross1 == 3 )
               return deep[index1 + index3][index2 + index3]
            
            let index22 = EDGE_LENGTH - 1 - index2
            if ( deep[index1 + index3][index22 - index3] != null && deep[index1 + index3][index22 - index3] == deep[index1 + index3 + 1][index22 - index3 - 1] )
               countRepeatCross2++
            else countRepeatCross2 = 1
            
            if ( countRepeatCross2 == 3 )
               return deep[index1 + index3][index22 - index3]
         }
      }
   }
   
} 
const cloneDeep = deep => {
   return JSON.parse( JSON.stringify(deep) )
}
const I_MAX = ($1, $2) => {
   return $1.point < $2.point ? $2 : $1
}
const I_MIN = ($1, $2) => {
   return $1.point > $2.point ? $2 : $1
}


const miniMax = (deep, countDeep = 0, isGetDeepAmazing, alpha = -Infinity, beta = Infinity) => {
   const free = memoryFree(deep)
   
   if ( free.length == 0 )
      return {
         point: 0,
         offset: NOT_DEEP
      }
   else {
      
      switch ( checkWin(deep) ) {
         case X:
            return { point: 10 - countDeep, offset: NOT_DEEP }
         case O:
            return { point: countDeep - 10, offset: NOT_DEEP }
      }
   }
   
   
   if ( countDeep > 20 ) {
      return isGetDeepAmazing ? MIN : MAX
   }
   
   let best = null
   
   if ( isGetDeepAmazing ) {
      best = MIN
      for ( let { x, y } of free ) {
         let newDeep = cloneDeep(deep)
         newDeep[ y ][ x ] = X
         best = I_MAX(best, {
            point: miniMax(newDeep, countDeep + 1, false, alpha, beta).point,
            offset: { x, y }
         })
         
         alpha = Math.max( alpha, best.point )
         
         if ( beta <= alpha  ) {
            break
         }
      }
   } else {
      best = MAX
      for ( let { x, y } of free ) {
         let newDeep = cloneDeep(deep)
         newDeep[ y ][ x ] = O
         best = I_MIN(best, {
            point: miniMax(newDeep, countDeep + 1, true, alpha, beta).point,
            offset: { x, y }
         })
         
         beta = Math.min( beta, best.point )
         
         if ( beta <= alpha ) {
            break
         }
      }
   }
   
   return best
}
const DEEP_DEFAULT = []

for ( let i = 0; i < EDGE_LENGTH; i++ ) {
   let tmp
   DEEP_DEFAULT.push(tmp = [])
   for ( let j = 0; j < EDGE_LENGTH; j++ ) {
      tmp.push(null)
   }
}


new Vue({
   el: "#app",
   data: {
      deep: DEEP_DEFAULT,
      turn: X
   },
   methods: {
      handlerClick(y, x) {
         
         if ( this.turn == O )
            return false;
         
         this.$set( this.deep[y], x, X )
         this.turn = O
         
         this.AINext()
      },
      AINext() {
         if ( this.turn == X )
            return false;
            
         let { offset } = miniMax(this.deep, 0, false)
         //console.log( offset )
         //return 
         this.$set( this.deep[offset.y], offset.x, O )
         
         this.turn = X
      }
   }
})
