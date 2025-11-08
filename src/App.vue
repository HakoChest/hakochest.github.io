
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Header -->
    <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          HakoChest's Books
        </h1>
        <p class="text-slate-400 mt-1">Documentation & Knowledge Base</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-12">
      <!-- Hero Section -->
      <section class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">Welcome to My Knowledge Hub</h2>
          <p class="text-lg text-slate-300">A collection of technical documentation and guides</p>
        </div>
      </section>

      <!-- Books Grid -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
        <!-- GXCI Books -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors p-6">
          <h3 class="text-2xl font-bold text-blue-400 mb-4">GXCI Documentation</h3>
          <p class="text-slate-300 mb-6">Comprehensive guides for GXCI framework and API</p>
          <div class="space-y-2">
            <a
              href="/gxci-cn/"
              target="_blank"
              class="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-center"
            >
              中文文档 (Chinese)
            </a>
            <a
              href="/gxci-en/"
              target="_blank"
              class="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-center"
            >
              English Documentation
            </a>
          </div>
        </div>

        <!-- Vielpork Books -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500 transition-colors p-6">
          <h3 class="text-2xl font-bold text-cyan-400 mb-4">Vielpork Documentation</h3>
          <p class="text-slate-300 mb-6">Guides and references for Vielpork project</p>
          <div class="space-y-2">
            <a
              href="/vielpork-cn/"
              target="_blank"
              class="block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors text-center"
            >
              中文文档 (Chinese)
            </a>
            <a
              href="/vielpork-en/"
              target="_blank"
              class="block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors text-center"
            >
              English Documentation
            </a>
          </div>
        </div>
        
        <!-- OSU API TypeDoc -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 hover:border-pink-500 transition-colors p-6">
          <h3 class="text-2xl font-bold text-pink-400 mb-4">Osynic OSU API</h3>
          <p class="text-slate-300 mb-6">Type documentation for Osynic OSU API</p>
          <div class="space-y-2">
            <a
              href="/osynic-osuapi/"
              target="_blank"
              class="block px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded transition-colors text-center"
            >
              TypeDoc Reference
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-16 pt-8 border-t border-slate-700">
        <div class="text-center text-slate-400 text-sm">
          <p>&copy; 2024 HakoChest. All rights reserved.</p>
          <p class="mt-2">
            Built with
            <span class="text-red-400">❤</span>
            using Vue + Tailwind CSS + mdbook
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
