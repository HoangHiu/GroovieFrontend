import React from "react";

interface CoverGridProps {
    coverUrls: string[];
    size?: number;
    gap?: number;
}

const CoverGrid: React.FC<CoverGridProps> = ({
                                                 coverUrls,
                                                 size = 100,
                                                 gap = 2,
                                             }) => {
    // Ensure we only map the first 4
    const urls = coverUrls.slice(0, 4);

    // Each cell is half of the container minus half the gap
    const cellSize = size / 2 - gap / 2;

    return (
        <div
            className="relative"
    style={{
        width: size,
            height: size,
    }}
>
    {urls.map((url, idx) => {
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        return (
            <img
                key={idx}
        src={url}
        alt={`Cover ${idx + 1}`}
        className="object-cover rounded-sm shadow-sm"
        style={{
            width: cellSize,
                height: cellSize,
                position: "absolute",
                top: row * (cellSize + gap),
                left: col * (cellSize + gap),
        }}
        />
    );
    })}
    </div>
);
};

export default CoverGrid;
