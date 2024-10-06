import React from 'react'

function Footer() {
  return (
    <footer className="mt-12 border-t">
    <div className="container mx-auto px-4 py-6 text-center text-sm">
      <p>© 2023 Multi-Wallet Manager. All rights reserved.</p>
      <p className="mt-2 text-muted-foreground">
        Remember to keep your mnemonic phrases and private keys secure. Never share them with anyone.
      </p>
    </div>
  </footer>
  )
}

export default Footer