import { Outlet } from "react-router"
import {SidebarComponent} from "@syncfusion/ej2-react-navigations"
import NavItems from "components/NavItems"

const adminLayout = () => {
  return (
    <div className="admin-layout">
      MobileSidebar
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent>
            <NavItems></NavItems>
        </SidebarComponent>
      </aside>
      <aside className="children">
          <Outlet></Outlet>
      </aside>
    </div>
  )
}

export default adminLayout
