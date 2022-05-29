import { Linked, PreRoundedPoint } from "./types"

const calcLimit = (
  curr:   Linked<PreRoundedPoint>,
) => {

  const prev = curr.prev,
        next = curr.next,
        lim = curr.arc.lim!

  // if prev locked
  if (prev.locked && !next.locked)
    curr.arc.radius = next.arc.lim !== undefined
    ? Math.min(
        (curr.out.length - (next.arc.lim * next.angle.vel)) / curr.angle.vel,
        curr.in.rest / curr.angle.vel,
        lim
      )
    : Math.min(curr.in.rest / curr.angle.vel, lim)

  // if next locked
  else if (next.locked && !prev.locked)
    curr.arc.radius = prev.arc.lim !== undefined
    ? Math.min(
        (curr.in.length - (prev.arc.lim * prev.angle.vel)) / curr.angle.vel,
        curr.out.rest / curr.angle.vel,
        lim
      )
    : Math.min(curr.out.rest / curr.angle.vel, lim)

  // if BOTH locked
  else if (next.locked && prev.locked)
    curr.arc.radius =
      Math.min(curr.in.rest / curr.angle.vel, curr.out.rest / curr.angle.vel, lim)

  // if NONE locked
  else {
    // if prev has limit
    if (prev.arc.lim !== undefined && next.arc.lim === undefined)
      curr.arc.radius = Math.min(curr.in.length / (curr.angle.vel + prev.angle.vel), lim)

    // if next has limit
    else if (next.arc.lim !== undefined && prev.arc.lim === undefined)
      curr.arc.radius = Math.min(curr.out.length / (curr.angle.vel + next.angle.vel), lim)

    // if BOTH have limit
    else if (next.arc.lim !== undefined && prev.arc.lim !== undefined) {
      
      const
        currOffset = curr.angle.vel * lim,
        prevOffset = prev.angle.vel * prev.arc.lim,
        nextOffset = next.angle.vel * next.arc.lim,
        prevRest = curr.in.length  - (prevOffset + currOffset),
        nextRest = curr.out.length - (nextOffset + currOffset)

      if (prevRest >= 0 && nextRest >= 0) {
          curr.arc.radius = lim
      }

      // if prev rest negative
      else if (prevRest < 0 && nextRest >= 0) {          
          const hit = curr.in.length / (curr.angle.vel + prev.angle.vel)
          if (lim >= hit && prev.arc.lim >= hit) {
            curr.arc.radius = hit
          }
          else if (lim >= hit && prev.arc.lim < hit) {
            curr.arc.radius = Math.min((curr.in.length - (prev.arc.lim * prev.angle.vel)) / curr.angle.vel, lim)
          }
          else if (lim < hit && prev.arc.lim >= hit) {
            curr.arc.radius = lim
          }
      }
    
      // if next rest negative
      else if (nextRest < 0 && prevRest >= 0) {
          const hit = curr.out.length / (curr.angle.vel + next.angle.vel)
          if (lim >= hit && next.arc.lim >= hit) {
            curr.arc.radius = hit
          }
          else if (lim >= hit && next.arc.lim < hit) {
            curr.arc.radius = Math.min((curr.out.length - (next.arc.lim * next.angle.vel)) / curr.angle.vel, lim)
          }
          else if (lim < hit && next.arc.lim >= hit) {
            curr.arc.radius = lim
          }
      }

      // if BOTH rest negative
      else {
        const
          prevhit = curr.in.length / (curr.angle.vel + prev.angle.vel),
          nexthit = curr.out.length / (curr.angle.vel + next.angle.vel)

          curr.arc.radius = Math.min(prevhit, nexthit, lim)
        
        if (prevhit < nexthit) {
          const prerest = (curr.in.length - (prev.arc.lim * prev.angle.vel)) / curr.angle.vel
          if (lim >= prevhit && prev.arc.lim >= prevhit) {
            curr.arc.radius = prevhit
          }
          else if (lim >= prevhit && prev.arc.lim < prevhit) {
            curr.arc.radius = Math.min(prerest, lim)
          }
          else if (lim < prevhit && prev.arc.lim >= prevhit) {
            curr.arc.radius = lim
          }
        }
        else {
          const prerest = (curr.out.length - (next.arc.lim * next.angle.vel)) / curr.angle.vel
          if (lim >= nexthit && next.arc.lim >= nexthit) {
            curr.arc.radius = nexthit
          }
          else if (lim >= nexthit && next.arc.lim < nexthit) {
            curr.arc.radius = Math.min(prerest, lim)
          }
          else if (lim < nexthit && next.arc.lim >= nexthit) {
            curr.arc.radius = lim
          }
        }
      }
    }

    // if NONE have limit
    else
      curr.arc.radius = Math.min(
        curr.in.length / curr.angle.vel,
        curr.out.length / curr.angle.vel,
        lim
      )
  }

  lockPoint(curr)
  
  // to get right getMinHit then
  prev.arc.hit = Math.min(
    prev.in.length / (prev.angle.vel + prev.prev.angle.vel),
    prev.out.rest / prev.angle.vel
  )
  next.arc.hit = Math.min(
    next.out.length / (next.angle.vel + next.next.angle.vel),
    next.in.rest / next.angle.vel
  )
}


const lockPoint = (curr: Linked<PreRoundedPoint>) => {
  curr.offset = curr.arc.radius * curr.angle.vel

  curr.prev.out.rest -= curr.offset
  curr.in.rest -= curr.offset
  curr.out.rest -= curr.offset
  curr.next.in.rest -= curr.offset

  curr.locked = true
}