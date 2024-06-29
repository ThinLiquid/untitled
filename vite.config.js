// @ts-nocheck
import { defineConfig } from 'vite'

import { viteStaticCopy } from 'vite-plugin-static-copy'

import { uvPath } from '@titaniumnetwork-dev/ultraviolet'
import { epoxyPath } from '@mercuryworkshop/epoxy-transport'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `${uvPath}/**/*`.replace(/\\/g, '/'),
          dest: 'uv',
          overwrite: false
        },
        {
          src: `${epoxyPath}/**/*`.replace(/\\/g, '/'),
          dest: 'epoxy',
          overwrite: false
        }
      ]
    })
  ]
})
