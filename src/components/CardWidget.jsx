import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

export default function CardWidget({
  title,
  description,
  action,
  children,
  sx,
  contentSx,
  ...rest
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        ...sx,
      }}
      {...rest}
    >
      <CardHeader
        title={title}
        action={action}
        subheader={description}
        titleTypographyProps={{
          variant: "h2",
          component: "h2",
          sx: {
            fontSize: "inherit",
            fontWeight: "inherit",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          },
        }}
      ></CardHeader>
      <CardContent sx={{ ...contentSx }}>{children}</CardContent>
    </Card>
  );
}

CardWidget.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node,
  sx: PropTypes.object,
  contentSx: PropTypes.object,
};
