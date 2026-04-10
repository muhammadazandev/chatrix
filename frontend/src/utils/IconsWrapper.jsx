export default function IconsWrapper({ icon: Icon, size = 24 }) {
  return (
    <Icon
      size={size}
      color={"currentColor"}
      className="transition-transform duration-200 hover:scale-110"
    />
  );
}
