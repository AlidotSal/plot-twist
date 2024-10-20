import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import solidStyled from 'vite-plugin-solid-styled';


export default defineConfig({
  plugins: [
    solid(),
    solidStyled({
      prefix: 'my-prefix', // optional
      filter: {
        include: 'src/**/*.{ts,js,tsx,jsx}',
        exclude: 'node_modules/**/*.{ts,js,tsx,jsx}',
      },
    }),
  ]
})