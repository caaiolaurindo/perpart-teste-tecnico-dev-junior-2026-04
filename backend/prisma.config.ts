export default defineConfig({
    migrations: {
        seed: './seed.ts',
    },
    datasource: {
        url: 'http://localhost:5432/',
    },
});
