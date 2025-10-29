import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminFooter from "@/components/AdminFooter";
import AdminPassword from "@/components/AdminPassword";
import AdminSchedule from "@/components/AdminSchedule";

const AdminSettings = () => {
  return (
    <div>
      <Tabs defaultValue="schedule" className="">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule">
          <AdminSchedule/>
        </TabsContent>
        <TabsContent value="footer">
          <AdminFooter/>
        </TabsContent>
        <TabsContent value="password">
            <AdminPassword/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
