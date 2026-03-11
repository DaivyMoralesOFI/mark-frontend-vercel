// breadcrumb-router.tsx
//
// This file defines a dynamic breadcrumb navigation component for the application.
// It generates breadcrumbs based on the current route, supports collapsing for long paths, and uses custom UI components for styling.

import { Link, useLocation } from "react-router-dom";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/Breadcrumb";
import { ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * BreadcrumbSegment
 *
 * Represents a single segment in the breadcrumb trail.
 */
interface BreadcrumbSegment {
  name: string;
  href: string;
  isCurrent: boolean;
}

/**
 * DynamicBradcrumbs
 *
 * Renders a dynamic breadcrumb navigation bar based on the current route.
 * Collapses breadcrumbs if the path is too long, showing ellipsis for hidden segments.
 */
const DynamicBradcrumbs: React.FC = () => {
  const location = useLocation();

  // Maximum number of segments before collapsing
  const MAX_SEGMENTS = 5;
  // Number of items to display at the end when collapsed
  const ITEMS_TO_DISPLAY = 3;

  /**
   * Generates an array of breadcrumb segments from the current pathname.
   */
  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const path_name = location.pathname;
    const path_segments = path_name.split("/").filter((segment) => segment);

    const breadcrumbs: BreadcrumbSegment[] = [];

    let path = "";
    path_segments.forEach((segment, index) => {
      path += `/${segment}`;

      // Convert segment to a readable name (capitalize, replace dashes)
      const redableName = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        name: redableName,
        href: path,
        isCurrent: index === path_segments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Determine if breadcrumbs should be collapsed
  const shouldCollapse = breadcrumbs.length > MAX_SEGMENTS;

  let visibleBreadcrumbs: BreadcrumbSegment[] = [];

  if (shouldCollapse) {
    // Show the first and last few segments, collapse the middle
    visibleBreadcrumbs.push(breadcrumbs[0]);
    const last_items = breadcrumbs.slice(-ITEMS_TO_DISPLAY);
    visibleBreadcrumbs = [...visibleBreadcrumbs, ...last_items];
  } else {
    visibleBreadcrumbs = breadcrumbs;
  }

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {visibleBreadcrumbs.map((breadcrumb, index) => {
          // Render ellipsis if collapsed and at the second position
          if (shouldCollapse && index === 1) {
            return (
              <Fragment>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis>
                    <MoreHorizontal className="w-4 h-4" />
                  </BreadcrumbEllipsis>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
              </Fragment>
            );
          }

          return (
            <Fragment key={breadcrumb.href}>
              {/* Render separator except for the first item or after ellipsis */}
              {!(shouldCollapse && index === 1) && index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
              )}
              {breadcrumb.isCurrent ? (
                <BreadcrumbItem className="text-xs">
                  <BreadcrumbPage className="font-semibold">{breadcrumb.name}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem className="text-xs">
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.href}>{breadcrumb.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBradcrumbs;
