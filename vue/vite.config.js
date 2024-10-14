import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

import {
	resolve
} from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@/assets/css/layout.scss";`, // 引入全局 SCSS 文件
			},
		},
	},
	resolve: {
		alias: {
			/** @ 符号指向 src 目录 */
			"@": resolve(__dirname, "./src")
		}
	},
	extensions: ['.js', '.vue', '.json'], // 添加默认的后缀名

})
