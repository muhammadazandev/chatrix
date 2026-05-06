export default function IconsWrapper({ icon: Icon, size = 24, color = "currentColor" }) {
  return (
    <Icon
      size={size}
      color={color}
      className="transition-transform duration-200 hover:scale-110 max-w-fit"
    />
  );
}
