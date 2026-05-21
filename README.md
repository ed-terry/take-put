# Take-Put CLI

A powerful cross-platform CLI tool that acts as a system-wide file/folder clipboard manager. Take files or folders from anywhere, roam around your filesystem, and put them wherever you need—all from the command line.

**Author:** Edward Terry  
**Email:** ask@edwardterry.co.tz  
**GitHub:** [@ed-terry](https://github.com/ed-terry)  
**Portfolio:** [edwardterry.co.tz](https://edwardterry.co.tz)

---

## Features

- **Take Command** - Capture files or folders for later use
- **Put Command** - Paste captured items into any directory
- **Copy Mode** - Copy files without removing originals (use `-c` flag)
- **Move Mode** - Move files (cut and paste behavior) - *default*
- **Clear Command** - Purge the clipboard and temp storage
- **Status Command** - View what's currently in your clipboard
- **Swap Command** - Exchange positions of clipboard item with another file
- **Cross-Platform** - Works seamlessly on Windows, macOS, and Linux
- **Verbose Mode** - Get detailed output with `-v` flag
- **Overwrite Protection** - Safe handling of existing files with `--overwrite` flag

---

## Installation

### From Source

```bash
git clone https://github.com/ed-terry/take-put.git
cd take-put
npm install
npm run install-cli
```

---

## Usage

### Basic Commands

#### Take a file (cut mode - default)
```bash
tp take /path/to/file.txt
```

#### Take a file (copy mode)
```bash
tp take /path/to/file.txt --copy
# or
tp take /path/to/file.txt -c
```

#### Put the file in current directory
```bash
tp put
```

#### Put the file in a specific directory
```bash
tp put /destination/path
```

#### Check what's in your clipboard
```bash
tp status
```

#### Clear the clipboard
```bash
tp clear
```

#### Swap with another file
```bash
tp swap /path/to/another/file.txt
```

---

## Examples

### Example 1: Moving a file across directories

```bash
# Navigate to source directory
cd ~/Documents

# Take the file (move mode - default)
tp take important.docx

# Navigate to destination
cd ~/Desktop

# Put the file
tp put

# Result: important.docx is now in ~/Desktop and removed from ~/Documents
```

### Example 2: Copying files without removing originals

```bash
# Copy a file
tp take ~/Downloads/photo.jpg --copy

# Navigate elsewhere
cd ~/Pictures/Archive

# Paste the copy
tp put

# Result: photo.jpg is now in both locations
```

### Example 3: Taking an entire folder

```bash
# Take a folder
tp take ~/old-project --copy

# Check what's in clipboard
tp status

# Navigate to backup location
cd ~/backups

# Put the folder
tp put

# Result: entire old-project folder is copied to ~/backups
```

### Example 4: Swapping files between locations

```bash
# Take a file
tp take ~/config/old-config.json

# Swap with another file
tp swap ~/config/new-config.json

# Result: files are exchanged in their locations, new-config.json is now in clipboard
```

### Example 5: Managing the clipboard

```bash
# Take a folder
tp take ~/large-folder --copy

# Check status with verbose output
tp status --verbose

# Later, clear when done
tp clear --verbose
```

---

## Command Reference

### `tp take <path> [options]`

Capture a file or folder to the clipboard.

**Options:**
- `-c, --copy` - Copy the file instead of cutting (moving)
- `-m, --move` - Move/cut the file (default behavior)
- `-v, --verbose` - Show detailed output

**Default Behavior:** Cuts files (moves on put)

**Examples:**
```bash
tp take ./myfile.txt
tp take ./folder -c
tp take ~/document.pdf --copy --verbose
```

---

### `tp put [destination] [options]`

Paste the taken file or folder.

**Options:**
- `-o, --overwrite` - Overwrite existing files without prompting
- `-v, --verbose` - Show detailed output

**Default Behavior:** Pastes to current directory if no destination specified

**Examples:**
```bash
tp put
tp put ~/Desktop
tp put ./backup --overwrite
tp put /destination --verbose
```

---

### `tp clear [options]`

Clear the clipboard and remove temporary files.

**Options:**
- `-v, --verbose` - Show detailed output

**Examples:**
```bash
tp clear
tp clear --verbose
```

---

### `tp status [options]`

Display what's currently in the clipboard.

**Options:**
- `-v, --verbose` - Show detailed output

**Examples:**
```bash
tp status
tp status --verbose
```

---

### `tp swap <path> [options]`

Exchange the clipboard item with another file.

**Options:**
- `-v, --verbose` - Show detailed output

**Examples:**
```bash
tp swap ~/Documents/config.json
tp swap ./backup.sql --verbose
```

---

## Advanced Usage

### Verbose Mode

Get detailed information about operations:

```bash
tp take ~/large-project --verbose
tp put /destination --verbose
tp status --verbose
```

### Handling Overwrite Scenarios

```bash
# This will fail if destination exists
tp put ~/Desktop

# This will overwrite silently
tp put ~/Desktop --overwrite
```

### Working with Large Files

The tool efficiently handles files and folders of any size:

```bash
# Take a large video file
tp take ~/Videos/movie.mkv --copy

# Take an entire project directory
tp take ~/workspace/project-name
```

---

## Clipboard Storage

Clipboard data is stored in:
- **Linux/macOS:** `~/.take-put/`
- **Windows:** `C:\Users\{username}\.take-put\`

The state file maintains:
- Current item path
- Operation mode (copy or move)
- Item metadata (size, type, timestamp)

---

## Cross-Platform Support

The tool is fully compatible with:
- **Windows** (10+)
- **macOS** (10.12+)
- **Linux** (All major distributions)

File operations are optimized for each platform:
- Windows: Uses copy + delete for move operations
- Unix-like systems: Uses native rename operations

---

## System Requirements

- **Node.js:** v14.0.0 or higher
- **npm:** v6.0.0 or higher

Check your versions:
```bash
node --version
npm --version
```

---

## Development

### Clone the repository
```bash
git clone https://github.com/ed-terry/take-put.git
cd take-put
```

### Install dependencies
```bash
npm install
```

### Run the CLI
```bash
npm start -- take ./test-file.txt
```

### Test the program
```bash
npm test
```

---

## License

MIT License - Feel free to use this tool for personal and commercial projects.

---

## Contributing

This project is solely developed and maintained by **Edward Terry**. Bug reports and feature suggestions are welcome via GitHub Issues, but pull requests are not accepted.

---

## Troubleshooting

### Issue: "Command not found"
**Solution:** Make sure you've installed the CLI globally:
```bash
npm install -g .
```

### Issue: "File not found" error
**Solution:** Use absolute paths or verify the file exists:
```bash
tp take "$(pwd)/myfile.txt"
```

### Issue: "Permission denied"
**Solution:** Ensure you have read/write permissions for the file and destination:
```bash
# Check permissions
ls -la /path/to/file

# Make sure destination is writable
ls -ld /destination/path
```

### Issue: Nothing in clipboard
**Solution:** Take a file first before putting:
```bash
tp take ~/myfile.txt
tp put ~/destination
```

---

## Tips & Tricks

1. **Create an alias for quick access:**
   ```bash
   alias tp='take-put'
   ```

2. **Use with current directory:**
   ```bash
   tp take . --copy  # Copy entire current folder
   ```

3. **Combine with other CLI tools:**
   ```bash
   tp take $(find . -name "*.log" | head -1)
   ```

4. **Check before moving:**
   ```bash
   tp status --verbose
   tp put /destination
   ```

5. **Safe overwriting:**
   ```bash
   # Always check first
   tp status
   tp put /destination --overwrite
   ```

---

## Contact & Support

- **Email:** ask@edwardterry.co.tz
- **GitHub:** [@ed-terry](https://github.com/ed-terry)
- **Portfolio:** [edwardterry.co.tz](https://edwardterry.co.tz)

For issues, feature requests, or suggestions, please open an issue on GitHub.

---

## Acknowledgments

Built using Node.js and inspired by clipboard management workflows.

**Made with:** 
- [Commander.js](https://github.com/tj/commander.js) - Command line interface
- [Chalk](https://github.com/chalk/chalk) - Terminal string styling

---

**Enjoy managing your files efficiently!**
