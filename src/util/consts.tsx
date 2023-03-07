const SYSTEM_PROMPT =
  "You are a friendly AI assistant. Answer only the question being asked in a concise manner. Markdown, KaTeX, and emojis are supported.";
const MAX_TOKENS = 300;

const fillerMarkdown = `
# Welcome to the React Markdown Previewer!

## This is a sub-heading...

### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`rust
// this is multi-line code:

fn fib(n: u32) -> u32 {
  if n <= 1 {
    return n;
  }
  fib(n - 1) + fib(n - 2)
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

$$ \\frac{1}{n^{2}} $$

- Bullet list

- With spacing

- And more spacing

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.
        
![React Logo w/ Text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png)

`;

export { fillerMarkdown, SYSTEM_PROMPT, MAX_TOKENS };
