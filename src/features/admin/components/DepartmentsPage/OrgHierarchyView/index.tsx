import { useMemo } from 'react'
import { useDepartmentTree } from '../../../hooks/use-departments'
import { useJobLevels } from '../../../hooks/use-job-levels'
import { ListView } from './ListView'
import { TreeView } from './TreeView'
import type { JobLevelOption } from './types'

interface OrgHierarchyViewProps {
  readonly initialView?: 'list' | 'tree'
}

// ponytail: orchestrator — owns jobLevels + tree shared by both sub-views; DepartmentsPage controls view mode via initialView
export function OrgHierarchyView({ initialView = 'list' }: OrgHierarchyViewProps) {
  const { data: tree, isLoading: isTreeLoading, isError: isTreeError, refetch: refetchTree } = useDepartmentTree()

  const { data: jobLevelsData } = useJobLevels({ Top: 100, NeedTotalCount: false })
  const jobLevels: JobLevelOption[] = useMemo(() =>
    (jobLevelsData?.items ?? [])
      .filter(jl => !jl.isDeleted)
      .sort((a, b) => a.levelOrder - b.levelOrder)
      .map(jl => ({ id: jl.id, levelName: jl.levelName })),
    [jobLevelsData],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex flex-1 p-2 overflow-hidden">
        {initialView === 'list'
          ? <ListView jobLevels={jobLevels} tree={tree} isLoading={isTreeLoading} isError={isTreeError} onRetry={refetchTree} />
          : <TreeView jobLevels={jobLevels} tree={tree} isLoading={isTreeLoading} isError={isTreeError} onRetry={refetchTree} />
        }
      </div>
    </div>
  )
}
