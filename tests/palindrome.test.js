const { palindrome } = require('../utils/for_testing.js')

test('palindrome of a', () => {
    const res = palindrome('a')

    expect(res).toBe('a')
})

test('palindrome of react', () => {
    const res = palindrome('react')

    expect(res).toBe('tcaer')
})

test('palindrome of releveler', () => {
    const res = palindrome('releveler')

    expect(res).toBe('releveler')
})
