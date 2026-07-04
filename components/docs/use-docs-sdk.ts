"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { getDefaultEngineVersion, getEngineVersionOrDefault, getEngineVersions } from "@/lib/docs/engine-versions"
import { DEFAULT_SDK_ID, getSdkOrDefault } from "@/lib/docs/sdk-registry"
import { getSnippetsForSdkSafe } from "@/lib/docs/sdk-snippets"
import {
  getVersionOrDefault,
  getVersionsForSdk,
  type SdkVersionDoc,
} from "@/lib/docs/sdk-versions"
import type { SdkDefinition } from "@/lib/docs/sdk-registry"
import type { SdkSnippets } from "@/lib/docs/sdk-snippets"
import type { EngineVersionDoc } from "@/lib/docs/engine-versions"

function buildDocsUrl(params: URLSearchParams): string {
  return `/docs?${params.toString()}`
}

export function useDocsSdk() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sdkId = searchParams.get("sdk") ?? DEFAULT_SDK_ID
  const sdk = useMemo(() => getSdkOrDefault(sdkId), [sdkId])
  const isAvailable = sdk.status === "available" || sdk.status === "beta"

  const versions = useMemo(() => getVersionsForSdk(sdk.id), [sdk.id])
  const version = useMemo(
    () => getVersionOrDefault(sdk.id, searchParams.get("v")),
    [sdk.id, searchParams],
  )

  const engine = useMemo(
    () => getEngineVersionOrDefault(searchParams.get("engine")),
    [searchParams],
  )

  const snippets = useMemo(
    () => getSnippetsForSdkSafe(sdk, engine.baseUrl, version) as SdkSnippets,
    [sdk, engine.baseUrl, version],
  )

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      router.replace(buildDocsUrl(params), { scroll: false })
    },
    [router, searchParams],
  )

  const setSdk = useCallback(
    (id: string) => {
      updateParams((params) => {
        params.set("sdk", id)
        params.delete("v")
      })
    },
    [updateParams],
  )

  const setVersion = useCallback(
    (v: string) => {
      updateParams((params) => {
        params.set("v", v)
      })
    },
    [updateParams],
  )

  const engineVersions = useMemo(() => getEngineVersions(), [])

  return {
    sdk,
    sdkId,
    isAvailable,
    snippets,
    versions,
    version,
    engine,
    engineVersions,
    setSdk,
    setVersion,
  } satisfies {
    sdk: SdkDefinition
    sdkId: string
    isAvailable: boolean
    snippets: SdkSnippets
    versions: SdkVersionDoc[]
    version: SdkVersionDoc | undefined
    engine: EngineVersionDoc
    engineVersions: EngineVersionDoc[]
    setSdk: (id: string) => void
    setVersion: (v: string) => void
  }
}
