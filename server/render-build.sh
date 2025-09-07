#!/bin/bash

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH for the current session
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Install dependencies and build
bun install
bun run build
