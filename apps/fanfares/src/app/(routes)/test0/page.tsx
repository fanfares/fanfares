import TestComponent from "@/components/TestCompoent";

export default function TestPage0() {
  return (
    <>
      <p>Test Page 0</p>
      <TestComponent content="Page 0" toPage="/test1"/>
    </>
  );
}
