import { getItem, setItem, STORAGE_KEYS } from './storage'

// Enhanced bag CRUD + audit helpers with better error handling

export function getBags() {
  try {
    return getItem(STORAGE_KEYS.BAGS) || []
  } catch (error) {
    console.error('Error getting bags:', error)
    return []
  }
}

export function getBagById(bagId) {
  if (!bagId) {
    throw new Error('Bag ID is required')
  }
  
  try {
    const bags = getBags()
    const bag = bags.find(b => b.bagId === bagId)
    
    if (!bag) {
      throw new Error(`Bag with ID ${bagId} not found`)
    }
    
    return bag
  } catch (error) {
    console.error('Error getting bag by ID:', error)
    throw error
  }
}

export function createBag(bag) {
  if (!bag) {
    throw new Error('Bag data is required')
  }

  if (!bag.bagId) {
    throw new Error('Bag ID is required')
  }

  if (!bag.studentRoll) {
    throw new Error('Student roll number is required')
  }

  if (typeof bag.declaredCount !== 'number' || bag.declaredCount < 1) {
    throw new Error('Declared count must be a positive number')
  }

  try {
    const bags = getBags()
    
    if (bags.some(b => b.bagId === bag.bagId)) {
      throw new Error(`Bag ID ${bag.bagId} already exists`)
    }

    // Ensure audit array
    bag.audit = bag.audit || []
    bag.audit.unshift({ 
      action: 'Dropped', 
      by: `student:${bag.studentRoll || 'unknown'}`, 
      timestamp: new Date().toISOString(), 
      details: `Declared count ${bag.declaredCount}` 
    })

    // Ensure countHistory
    bag.countHistory = bag.countHistory || []
    if (bag.countHistory.length === 0) {
      bag.countHistory.push({ 
        stage: 'Dropped', 
        count: bag.declaredCount, 
        timestamp: bag.dropoffTimestamp || new Date().toISOString() 
      })
    }

    bags.unshift(bag)
    setItem(STORAGE_KEYS.BAGS, bags)
    return bag
  } catch (error) {
    console.error('Error creating bag:', error)
    throw error
  }
}

export function updateBag(bagId, patch) {
  if (!bagId) {
    throw new Error('Bag ID is required')
  }

  if (!patch || typeof patch !== 'object') {
    throw new Error('Patch data must be an object')
  }

  try {
    const bags = getBags()
    const idx = bags.findIndex(b => b.bagId === bagId)
    
    if (idx === -1) {
      throw new Error(`Bag with ID ${bagId} not found`)
    }

    bags[idx] = { ...bags[idx], ...patch }
    setItem(STORAGE_KEYS.BAGS, bags)
    return bags[idx]
  } catch (error) {
    console.error('Error updating bag:', error)
    throw error
  }
}

export function appendAudit(bagId, entry) {
  if (!bagId) {
    throw new Error('Bag ID is required')
  }

  if (!entry || !entry.action) {
    throw new Error('Audit entry must have an action')
  }

  try {
    const bags = getBags()
    const idx = bags.findIndex(b => b.bagId === bagId)
    
    if (idx === -1) {
      throw new Error(`Bag with ID ${bagId} not found`)
    }

    bags[idx].audit = bags[idx].audit || []
    bags[idx].audit.unshift({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    })
    
    setItem(STORAGE_KEYS.BAGS, bags)
    return bags[idx]
  } catch (error) {
    console.error('Error appending audit:', error)
    throw error
  }
}

export function assignBag(bagId, staffId) {
  if (!bagId) {
    throw new Error('Bag ID is required')
  }

  if (!staffId) {
    throw new Error('Staff ID is required')
  }

  try {
    const bag = updateBag(bagId, { assignedStaffId: staffId })
    appendAudit(bagId, { 
      action: 'Assigned', 
      by: staffId, 
      timestamp: new Date().toISOString(), 
      details: `Assigned to ${staffId}` 
    })
    return bag
  } catch (error) {
    console.error('Error assigning bag:', error)
    throw error
  }
}

export function recordStage(bagId, stage, staffId, count) {
  if (!bagId) {
    throw new Error('Bag ID is required')
  }

  if (!stage) {
    throw new Error('Stage is required')
  }

  if (!staffId) {
    throw new Error('Staff ID is required')
  }

  if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
    throw new Error('Count must be a non-negative integer')
  }

  const validStages = ['Dropped', 'Washing', 'Drying', 'Ready for Pickup', 'Picked Up']
  if (!validStages.includes(stage)) {
    throw new Error(`Invalid stage: ${stage}. Must be one of: ${validStages.join(', ')}`)
  }

  try {
    const bag = getBagById(bagId)
    
    if (!bag) {
      throw new Error(`Bag with ID ${bagId} not found`)
    }

    const now = new Date().toISOString()
    const newHistory = [...(bag.countHistory || []), { stage, count, timestamp: now }]
    
    const patch = { 
      countHistory: newHistory, 
      status: stage 
    }

    updateBag(bagId, patch)
    
    appendAudit(bagId, { 
      action: stage, 
      by: staffId, 
      timestamp: now, 
      details: `count=${count}` 
    })
    
    return getBagById(bagId)
  } catch (error) {
    console.error('Error recording stage:', error)
    throw error
  }
}
