interface SKUDTO {
  title: string;
  attributes: any;
}

export function generateSKU({ title, attributes }: SKUDTO) {
  const base = title.toLowerCase().replace(/\s+/g, "-").slice(0, 20);
  const attrs = attributes.map((atr: any) => atr.value.toUpperCase()).join("-");
  const unique = Date.now().toString().slice(0, 4);
  //   return `${base}-${attrs}`;
  return `${base}-${attrs}-${unique}`;
}
