"use client";
import { type ReactNode, Suspense } from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";

import { App } from "antd";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import { Provider } from "@/lib/Provider";
import "@ant-design/v5-patch-for-react-19";


dayjs.extend(relativeTime);
dayjs.extend(isToday);

export default function Client({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <App>
        <Provider>
          <Suspense>{children} </Suspense>
        </Provider>
      </App>
    </AntdRegistry>
  );
}
