import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/products";

export function FaqList() {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-border">
      {FAQS.map((item) => (
        <Accordion.Item key={item.q} value={item.q} className="py-1">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-left">
              <span className="font-display text-lg font-medium tracking-tight text-fg">
                {item.q}
              </span>
              <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-fast ease-out-smooth group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
            <p className="max-w-2xl pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
