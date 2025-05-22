import { NextRequest, NextResponse } from 'next/server';
import { updateNode, deleteNode, getNode } from '@/services/nodeService';
import Logger from '@/utils/logger';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ nodeId: string }> }
) {
    try {
        const { nodeId } = await params;

        if (!nodeId) {
            return NextResponse.json(
                { error: "Node ID is required" },
                { status: 400 }
            );
        }

        const result = await getNode(nodeId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: result.error === 'Node not found' ? 404 : 400 }
            );
        }

        return NextResponse.json({
            success: true,
            node: result.node
        });
    } catch (error) {
        Logger.error("Error fetching node:", error);
        return NextResponse.json(
            { error: "Failed to fetch node" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ nodeId: string }> }
) {
    try {
        const { nodeId } = await params;
        const body = await request.json();

        // Validate required fields
        if (!nodeId) {
            return NextResponse.json(
                { error: "Node ID is required" },
                { status: 400 }
            );
        }

        const result = await updateNode(nodeId, {
            label: body.label,
            description: body.description,
            type: body.type,
            positionX: body.positionX,
            positionY: body.positionY
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, node: result.node }
        );
    } catch (error) {
        console.error("Error updating node:", error);
        return NextResponse.json(
            { error: "Failed to update node" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest,
    { params }: { params: Promise<{ nodeId: string }> }
) {
    try {
        const { nodeId } = await params;

        if (!nodeId) {
            return NextResponse.json(
                { error: "Node ID is required" },
                { status: 400 }
            );
        }

        const result = await deleteNode(nodeId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true }
        );
    } catch (error) {
        console.error("Error deleting node:", error);
        return NextResponse.json(
            { error: "Failed to delete node" },
            { status: 500 }
        );
    }
}
