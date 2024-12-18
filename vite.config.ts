import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8081,
		proxy: {
			'/mlogin': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/msndfactorconfirm': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/mlogout': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/api': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/empmenu': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/uhr': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/wrk': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/system': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/org': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/wlf': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/files': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/edu': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/emp': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/pay': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			'/one': {
				target: 'http://10.141.5.95:6120', // 모바일 WAS 서버 주소
				// target: 'http://10.144.250.182:8081', // 테스트
				changeOrigin: true,
				secure: false,
			},
			// '/UView5': {
			// 	target: 'http://10.141.5.197:8120', // 프린트 서버
			// 	// target: 'http://10.144.250.182:8081', // 테스트
			// 	changeOrigin: true,
			// 	secure: false,
			// },
			
		},
	},
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@/assets/styles/common.scss";`,
			},
		},
	},
});
