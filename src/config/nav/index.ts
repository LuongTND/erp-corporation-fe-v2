export type { NavItem, NavSection } from './nav.admin'
export { adminNav } from './nav.admin'
export { hrmNav } from './nav.hrm'
export { lmsNav } from './nav.lms'

import { adminNav } from './nav.admin'
import { hrmNav } from './nav.hrm'
import { lmsNav } from './nav.lms'

export const NAV_SECTIONS = [...adminNav, ...hrmNav, ...lmsNav]
