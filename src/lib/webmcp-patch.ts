/**
 * Patches navigator.modelContext.registerTool to be idempotent.
 *
 * The @mcp-b/global polyfill throws "Duplicate tool name" when registering
 * a tool that already exists. During client-side route transitions (e.g.
 * landing → dashboard), the new route's tools may register before the
 * previous route's cleanup runs. This patch auto-unregisters any existing
 * tool with the same name before registering the new one.
 *
 * Must be called once, before any tool registration happens.
 */

interface PatchedModelContext {
  __patched?: boolean;
  registerTool: (tool: { name: string }) => unknown;
  unregisterTool: (name: string) => void;
}

export function patchModelContextRegistration(): void {
  if (typeof navigator === "undefined" || !navigator.modelContext) return;

  const mc = navigator.modelContext as unknown as PatchedModelContext;
  if (mc.__patched) return;

  const originalRegister = mc.registerTool.bind(mc);
  const originalUnregister = mc.unregisterTool.bind(mc);

  mc.registerTool = (tool: { name: string }) => {
    try {
      originalUnregister(tool.name);
    } catch {
      // Tool wasn't registered — safe to ignore
    }
    return originalRegister(tool);
  };

  mc.__patched = true;
}
