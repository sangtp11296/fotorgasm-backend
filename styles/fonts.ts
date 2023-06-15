import localFont from "next/font/local"

export const NeueHelvetica = localFont({
    src: [
        {
            path: '../public/assets/fonts/NeueHelvatica/helvetica-neue-regular.ttf',
            weight: '400',
            style: 'normal'
        },
        {
            path: '../public/assets/fonts/NeueHelvatica/helvetica-neue-medium.ttf',
            weight: '500',
            style: 'normal'
        },
        {
            path: '../public/assets/fonts/NeueHelvatica/helvetica-neue-light.ttf',
            weight: '300',
            style: 'normal'
        },
        {
            path: '../public/assets/fonts/NeueHelvatica/helvetica-neue-ultra-light.ttf',
            weight: '200',
            style: 'normal'
        },
        {
            path: '../public/assets/fonts/NeueHelvatica/helvetica-neue-bold.ttf',
            weight: '700',
            style: 'normal'
        },
        {
            path: '../public/assets/fonts/NeueHelvatica/helvetica-neue-italic.ttf',
            weight: '400',
            style: 'italic'
        },
        {
            path: '../public/assets/fonts/NeueHelvatica/helvetica-neue-light-italic.ttf',
            weight: '300',
            style: 'italic'
        },
    ]
})