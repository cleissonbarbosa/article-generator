import Card from "../card/Card";

type Props = {
    children: React.ReactNode;
    className?: React.CSSProperties['className'];
};

export default function ContextCard({ children, className }: Props) {
    return (
        <Card className={className}>
            {children}
        </Card>
    );
}
