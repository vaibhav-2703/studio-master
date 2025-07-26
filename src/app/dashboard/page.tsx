
"use client";

import { Button } from "@/components/ui/button";
import { LinksTable } from "@/components/dashboard/LinksTable";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getLinks } from "@/lib/data-service";
import { LinkData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCreateLinkClick = () => {
    router.push('/');
  }

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const fetchedLinks = await getLinks();
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Failed to fetch links", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleLinkDeleted = (deletedLinkId: string) => {
    setLinks(prevLinks => prevLinks.filter(link => link.id !== deletedLinkId));
    fetchLinks();
  };

  const handleLinkUpdated = (updatedLink: LinkData) => {
    setLinks(prevLinks => prevLinks.map(link => (link.id === updatedLink.id ? updatedLink : link)));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">All Links</h1>
        <Button className="flex items-center gap-2" onClick={handleCreateLinkClick}>
          <PlusCircle className="h-4 w-4" />
          Create New Link
        </Button>
      </div>
      <div
        className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4"
      >
        {loading ? (
            <div className="w-full p-4 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <LinksTable 
              links={links} 
              onLinkDeleted={handleLinkDeleted}
              onLinkUpdated={handleLinkUpdated}
            />
          )
        }
      </div>
    </>
  );
}
