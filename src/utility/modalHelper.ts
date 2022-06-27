export default function show(instance: Vue, name: string): void {
  const targetModal = instance.$children.find((i: any) => i.id === name);
  (targetModal as any).show();
}
