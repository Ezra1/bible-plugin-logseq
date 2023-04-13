// Import the 'axios' library for making HTTP requests
import axios from 'axios'

// Import the 'Plugin' type from the 'logseq-pdk' package
import { Plugin } from 'logseq-pdk'

// Define a constant to store the name of the plugin
const PLUGIN_NAME = 'my-plugin'

// Define an async function to handle the slash command
async function onSlashCommand(args: string[]) {
  // Check if the command is 'bible'
  if (args[0] === 'bible') {
    try {
      // Extract the reference from the command arguments
      const reference = args.slice(1).join(' ')

      // Call the 'getVerseText' function to retrieve the text of the Bible verse
      const verseText = await getVerseText(reference)

      // Insert a new block with the verse text
      const block = logseq.Editor.insertBlock({
        text: verseText,
        indent: 0,
        parent: logseq.Editor.activeBlock()
      })

      // Scroll to the newly inserted block
      logseq.Editor.scrollToBlock(block)
    } catch (error) {
      // Log an error message if the Bible verse cannot be inserted
      console.error(`Failed to insert Bible verse: ${error.message}`)
    }
  }
}

// Define an async function to retrieve the text of a Bible verse
async function getVerseText(reference: string): Promise<string> {
  // Construct the URL for the Bible Gateway API endpoint
  const url = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=NIV`

  // Make an HTTP GET request to the API endpoint using the 'axios' library
  const response = await axios.get(url)

  // Extract the verse text from the response HTML using a regular expression
  const verseText = response.data.match(/<div class="passage-text">(.*?)<\/div>/s)?.[1].trim()

  // Return the verse text, or an empty string if it cannot be found
  return verseText || ''
}

// Export an object with the plugin's name and event handler function
export default {
  PLUGIN_NAME,
  onSlashCommand
} as Plugin
