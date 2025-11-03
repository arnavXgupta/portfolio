import React from "react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

type Domains = readonly string[];

interface DomainsListProps {
  domains: Domains;
  className?: string;
}

function DomainsList({ domains, className }: DomainsListProps) {
  return (
    <ul className={cn("flex list-none flex-wrap gap-1 p-0", className)} aria-label="List of domains">
      {domains.map((domain) => (
        <li key={domain}>
          <Badge className="print:text-[10px]" aria-label={`Domain: ${domain}`}>
            {domain}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

interface DomainsProps {
  domains: Domains;
  className?: string;
}

export function Domains({ domains, className }: DomainsProps) {
  return (
    <Section className={className}>
      <h2 className="text-xl font-bold" id="domains-section">
        Domains
      </h2>
      <DomainsList domains={domains} aria-labelledby="domains-section" />
    </Section>
  );
}


