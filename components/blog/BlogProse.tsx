import type { BlogBlock } from "@/lib/blog/types";

export default function BlogProse({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <article className="blog-prose">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={key} className={block.level === 2 ? "blog-h2" : "blog-h3"}>
              {block.text}
            </Tag>
          );
        }

        if (block.type === "quote") {
          return (
            <figure key={key} className="blog-quote">
              <blockquote>{block.text}</blockquote>
              {block.cite ? <figcaption>{block.cite}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={key} className="blog-list">
              {block.items.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={key} className="blog-p">
            {block.text}
          </p>
        );
      })}
    </article>
  );
}
