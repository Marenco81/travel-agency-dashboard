import { Outlet, redirect } from "react-router"
import {SidebarComponent} from "@syncfusion/ej2-react-navigations"
import { MobileSidebar, NavItems } from "components"
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserdata } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();

    if(!user.$id) return redirect('/sign-in');

    const existigUser = await getExistingUser(user.$id);

    if(existigUser?.status === 'user') {
      redirect('/');
    }

    return existigUser?.$id ? existigUser : await storeUserdata()
  } catch (error) {
    console.log('Error in clientLoader' ,error);
    return redirect('/sign-in');
  }
}

const adminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar></MobileSidebar>

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
