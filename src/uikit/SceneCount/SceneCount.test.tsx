import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SceneCount } from './SceneCount.tsx'

describe('SceneCount', () => {
  it('renders the scene counter label', () => {
    render(<SceneCount />)
    expect(screen.getByText('10 сцен')).toBeInTheDocument()
  })
})
