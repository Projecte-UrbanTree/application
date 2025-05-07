import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Preloader from './Preloader'

describe('<Preloader />', () => {
  it('mostra la imatge del logo amb alt "Logo"', () => {
    render(<Preloader />)
    const img = screen.getByAltText('Logo')
    expect(img).toBeInTheDocument()
  })

  it('mostra el spinner de PrimeReact', () => {
    const { container } = render(<Preloader />)
    const spinner = container.querySelector('.p-progress-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('envolta tot amb un contenedor absolut amb z-index alt', () => {
    const { container } = render(<Preloader />)
    const wrapper = container.firstElementChild
    expect(wrapper).toHaveClass(
      'absolute',
      'inset-0',
      'bg-white',
      'z-50',
      'flex',
      'flex-col',
      'items-center',
      'justify-center'
    )
  })
})