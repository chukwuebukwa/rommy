import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb";
import { AnatomyWiki } from "@/components/AnatomyWiki";
import { TableOfContents } from "@/components/TableOfContents";

export default async function AnatomyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load FULL tree with all nested levels, exercises, and formulas
  const anatomy = await prisma.anatomyNode.findUnique({
    where: { id },
    include: {
      parent: true,
      formulaTargets: {
        include: {
          formula: {
            include: {
              steps: {
                include: {
                  exercise: true,
                },
                orderBy: {
                  order: "asc",
                },
              },
              targets: {
                include: {
                  anatomy: true,
                },
              },
            },
          },
        },
      },
      exerciseLinks: {
        include: {
          exercise: {
            include: {
              anatomyLinks: {
                include: {
                  anatomy: true,
                },
              },
            },
          },
        },
      },
      children: {
        include: {
          formulaTargets: {
            include: {
              formula: {
                include: {
                  steps: {
                    include: {
                      exercise: true,
                    },
                    orderBy: {
                      order: "asc",
                    },
                  },
                  targets: {
                    include: {
                      anatomy: true,
                    },
                  },
                },
              },
            },
          },
          exerciseLinks: {
            include: {
              exercise: {
                include: {
                  anatomyLinks: {
                    include: {
                      anatomy: true,
                    },
                  },
                },
              },
            },
          },
          children: {
            include: {
              formulaTargets: {
                include: {
                  formula: {
                    include: {
                      steps: {
                        include: {
                          exercise: true,
                        },
                        orderBy: {
                          order: "asc",
                        },
                      },
                      targets: {
                        include: {
                          anatomy: true,
                        },
                      },
                    },
                  },
                },
              },
              exerciseLinks: {
                include: {
                  exercise: {
                    include: {
                      anatomyLinks: {
                        include: {
                          anatomy: true,
                        },
                      },
                    },
                  },
                },
              },
              children: {
                include: {
                  formulaTargets: {
                    include: {
                      formula: {
                        include: {
                          steps: {
                            include: {
                              exercise: true,
                            },
                            orderBy: {
                              order: "asc",
                            },
                          },
                          targets: {
                            include: {
                              anatomy: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  exerciseLinks: {
                    include: {
                      exercise: {
                        include: {
                          anatomyLinks: {
                            include: {
                              anatomy: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  children: {
                    include: {
                      formulaTargets: {
                        include: {
                          formula: {
                            include: {
                              steps: {
                                include: {
                                  exercise: true,
                                },
                                orderBy: {
                                  order: "asc",
                                },
                              },
                              targets: {
                                include: {
                                  anatomy: true,
                                },
                              },
                            },
                          },
                        },
                      },
                      exerciseLinks: {
                        include: {
                          exercise: {
                            include: {
                              anatomyLinks: {
                                include: {
                                  anatomy: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!anatomy) {
    notFound();
  }

  // Build breadcrumb trail
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Anatomy", href: "/anatomy" },
  ];

  if (anatomy.parent) {
    breadcrumbItems.push({
      label: anatomy.parent.name,
      href: `/anatomy/${anatomy.parent.id}`,
    });
  }

  breadcrumbItems.push({ label: anatomy.name });

  // Build table of contents
  const buildTOC = (node: any, level: number = 1): any[] => {
    const items = [{ id: node.id, name: node.name, level }];
    if (node.children) {
      node.children.forEach((child: any) => {
        items.push(...buildTOC(child, level + 1));
      });
    }
    return items;
  };

  const tocSections = buildTOC(anatomy);

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Wikipedia-style layout with TOC sidebar */}
      <div className="flex gap-6 items-start">
        {/* Left: Table of Contents */}
        <TableOfContents sections={tocSections} />

        {/* Right: Main content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-8">
          <AnatomyWiki node={anatomy as any} level={1} />
        </div>
      </div>
    </div>
  );
}
