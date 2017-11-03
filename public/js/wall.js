class Wall extends StaticObject {

    render(context, x1, y1, x2, y2) {
        context.fillStyle = 'rgb(50, 90, 165)';
        context.fillRect(x1, y1, x2, y2);
    }

}
