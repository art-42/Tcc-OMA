/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest', // Usa ts-jest para lidar com TypeScript
    testEnvironment: 'node', // Define o ambiente para Node.js
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'], // Encontra arquivos .test.ts ou .spec.ts
    collectCoverage: true, // Gera relatório de cobertura
    collectCoverageFrom: ['src/**/*.ts'], // Analisa arquivos para cobertura
    coverageDirectory: 'coverage', // Pasta de saída da cobertura
  };
  